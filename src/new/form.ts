import chalk from "chalk";
import { execSync, spawn } from "node:child_process";
import { Presets, SingleBar } from "cli-progress";
import degit from "degit";
import inquirer from "inquirer";
import fs from "node:fs";
import path from "node:path";
import { centerText } from "../utils/center-text";
import { printError } from "../utils/cli-ui";
import { changePackageName } from "../utils/change-package-info";

async function packageManagerInstall({
	packageManager,
	directory,
	progressBar,
}: {
	packageManager: string;
	directory: string;
	progressBar: SingleBar;
}) {
	return new Promise((resolve, reject) => {
		const isWindows: boolean = process.platform === "win32";
		const command: string = isWindows
			? `${packageManager}.cmd`
			: packageManager;

		const installProcess = spawn(command, ["install", "--prefer-offline"], {
			cwd: directory,
			shell: true,
			timeout: 600000,
		});

		// eslint-disable-next-line prefer-const
		let installTimeout: NodeJS.Timeout;

		installProcess.on("error", (error) => {
			clearTimeout(installTimeout);
			reject(new Error(`Failed to start subprocess: ${error.message}`));
		});

		installProcess.stdout?.on("data", (data: Buffer) => {
			const output = data.toString().trim();

			const npmProgressMatch = output.match(
				/\[(\d+)\/(\d+)\] (?:npm )?([\w\s]+)\.{3}/,
			);

			if (npmProgressMatch) {
				const [, current, total, task] = npmProgressMatch;
				const progress = Math.round(
					(parseInt(current) / parseInt(total)) * 100,
				);
				progressBar.update(progress, { doing: task });
			} else {
				progressBar.increment(5, { doing: output });
			}
		});

		installProcess.on("close", (code) => {
			clearTimeout(installTimeout);
			if (code === 0) {
				resolve("Installation Done!");
			} else {
				reject(
					new Error(
						`${packageManager} install exited with code ${code}`,
					),
				);
			}
		});

		installTimeout = setTimeout(() => {
			installProcess.kill("SIGKILL");
			reject(new Error("Installation took too long. Aborted!"));
		}, 600000);
	});
}

async function checkIfPackageManagerExists(packageManager: string) {
	try {
		execSync(`${packageManager} --version`);
		return true;
	} catch (error) {
		printError("Package manager not found!", packageManager);
		process.exit(1);
	}
}

function renameEnvFile(directory: string): void {
	try {
		const envExamplePath = path.join(directory, ".env.example");
		const envPath = path.join(directory, ".env");

		if (!fs.existsSync(envExamplePath)) {
			throw new Error(`File not found: ${envExamplePath}`);
		}

		fs.renameSync(envExamplePath, envPath);
	} catch (error: any) {
		printError("Error renaming .env.example file", ".env.example to .env");
		process.exit(1);
	}
}

enum Template {
	"non-opinionated" = "Non-Opinionated :: Allows users to choose where to scaffold resources, offering flexible project organization.",
	opinionated = "Opinionated :: Automatically scaffolds resources into a preset project structure. (Recommended)",
}

const enum PackageManager {
	npm = "npm",
	yarn = "yarn",
	pnpm = "pnpm",
	bun = "bun",
}

type TemplateKeys = keyof typeof Template;

type ProjectFormArgs = [PackageManager, TemplateKeys, string];

const projectForm = async (
	projectName: string,
	args: ProjectFormArgs,
): Promise<void> => {
	let answer: {
		name: string;
		packageManager: string;
		template: Template;
		confirm: boolean;
	};
	const [packageManager, template, directory] = args;

	if (packageManager && template) {
		answer = {
			name: projectName,
			packageManager: packageManager,
			template: Template[template],
			confirm: true,
		};
	} else {
		answer = await inquirer.prompt([
			{
				type: "input",
				name: "name",
				message: "Project name",
				default: projectName,
				transformer: (input: string) => {
					return chalk.yellow(chalk.bold(input));
				},
			},
			{
				type: "list",
				name: "packageManager",
				message: "Package manager",
				choices: ["npm", "yarn", "pnpm", "bun"],
			},
			{
				type: "list",
				name: "template",
				message: "Select a template",
				choices: [
					`Opinionated :: Automatically scaffolds resources into a preset project structure. (${chalk.yellow(
						"Recommended",
					)})`,
					"Non-Opinionated :: Allows users to choose where to scaffold resources, offering flexible project organization.",
				],
			},
			{
				type: "confirm",
				name: "confirm",
				message: "Do you want to create this project?",
				default: true,
			},
		]);
	}

	if (directory) {
		if (!fs.existsSync(path.join(directory, answer.name))) {
			answer.name = path.join(directory, answer.name);
		} else {
			printError("Directory already exists", directory);
			process.exit(1);
		}
	}

	// Hashmap of templates and their directories
	const templates: Record<string, unknown> = {
		"Non-Opinionated": "non_opinionated",
		Opinionated: "opinionated",
	};

	if (answer.confirm) {
		// Check if package manager is bun and OS is Windows
		if (answer.packageManager === "bun" && process.platform === "win32") {
			printError(
				"bun is not supported on Windows. Please use",
				"npm, yarn or pnpm",
			);
			process.exit(1);
		}

		await checkIfPackageManagerExists(answer.packageManager);
		console.log("\n");
		const progressBar = new SingleBar(
			{
				format:
					"Progress |" +
					chalk.green("{bar}") +
					"| {percentage}% || {doing}",
				hideCursor: true,
			},
			Presets.rect,
		);

		progressBar.start(100, 0, {
			doing: "Cloning project",
		});

		const [_, template] = answer.template.match(/(.*) ::/) as Array<string>;

		try {
			const emitter = degit(
				`expressots/expressots/templates/${templates[template]}`,
			);

			await emitter.clone(answer.name);
		} catch (err: any) {
			console.log("\n");
			printError(
				"Project already exists or Folder is not empty",
				answer.name,
			);
			process.exit(1);
		}

		progressBar.update(50, {
			doing: "Installing dependencies",
		});

		await packageManagerInstall({
			packageManager: answer.packageManager,
			directory: answer.name,
			progressBar,
		});

		progressBar.update(90);

		changePackageName({
			directory: answer.name,
			name: projectName,
		});

		renameEnvFile(answer.name);

		progressBar.update(100);

		progressBar.stop();

		console.log("\n");
		console.log(
			"🐎 Project",
			chalk.green(answer.name),
			"created successfully!",
		);
		console.log("🤙 Run the following commands to start the project:\n");

		console.log(chalk.bold.gray(`$ cd ${answer.name}`));
		switch (answer.packageManager) {
			case "npm":
				console.log(chalk.bold.gray("$ npm run dev"));
				break;
			case "yarn":
				console.log(chalk.bold.gray("$ yarn dev"));
				break;
			case "pnpm":
				console.log(chalk.bold.gray("$ pnpm run dev"));
				break;
			case "bun":
				console.log(chalk.bold.gray("$ bun dev"));
				break;
		}

		console.log("\n");
		console.log(chalk.bold.green(centerText("Happy coding!")));
		console.log(
			chalk.bold.gray(
				centerText(
					"Please consider donating to support the project.\n",
				),
			),
		);
		console.log(
			chalk.bold.white(
				centerText(
					"💖 Sponsor: https://github.com/sponsors/expressots",
				),
			),
		);
		console.log("\n");
	}
};

export { projectForm };

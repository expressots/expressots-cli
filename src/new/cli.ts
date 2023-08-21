import { Argv, CommandModule } from "yargs";
import { projectForm } from "./form";

// eslint-disable-next-line @typescript-eslint/ban-types
type CommandModuleArgs = {};

const createProject = (): CommandModule<CommandModuleArgs, any> => {
	const packageManagers: Array<string> = ["npm", "yarn", "pnpm"];

	if (process.platform !== "win32") {
		packageManagers.push("bun");
	}

	return {
		command: "new <project-name> [package-manager] [template] [directory] [experimental]",
		describe: "Create a new project",
		builder: (yargs: Argv): Argv => {
			yargs
				.positional("project-name", {
					describe: "The name of the project",
					type: "string",
				})
				.option("template", {
					describe: "The project template to use",
					type: "string",
					choices: ["non-opinionated", "opinionated"],
					alias: "t",
				})
				.option("package-manager", {
					describe: "The package manager to use",
					type: "string",
					choices: packageManagers,
					alias: "p",
				})
				.option("directory", {
					describe: "The directory for new project",
					type: "string",
					alias: "d",
				})
				.option("experimental", {
					describe: "Use experimental traspile with swc",
					type: "boolean",
					default: false,
				})
				.implies("package-manager", "template")
				.implies("template", "package-manager");

			return yargs;
		},
		handler: async ({
			projectName,
			packageManager,
			template,
			directory,
			experimental,
		}) => {
			return await projectForm(projectName, [
				packageManager,
				template,
				directory,
				experimental,
			]);
		},
	};
};

export { createProject };

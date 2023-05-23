import chalk from "chalk";
import path from "path";
import fs from "fs";
import os from "os";
import { CLI_VERSION } from "../cli";

function getInfosFromPackage() {
	try {
			// Get the absolute path of the input directory parameter
		const absDirPath = path.resolve();
		// Load the package.json file
		const packageJsonPath = path.join(absDirPath, "package.json");

		const fileContents = fs.readFileSync(packageJsonPath, "utf-8");
		const packageJson = JSON.parse(fileContents);

		console.log(chalk.green("ExpressoTS Project:"));
		console.log(chalk.bold(`\tName: ${packageJson.name}`));
		console.log(chalk.bold(`\tDescription: ${packageJson.description}`));
		console.log(chalk.bold(`\tVersion: ${packageJson.version}`));
		console.log(chalk.bold(`\tAuthor: ${packageJson.author}`));

		console.log(chalk.green("CLI Version:"));
		console.log(chalk.bold(`\tCurrent version: v${CLI_VERSION}`));
	} catch (error) {
		console.log(chalk.green("\tExpressoTS Project:"));
		console.log(chalk.bold("\tpackage.json not found!"));
	}
}

const infoForm = async (): Promise<void> => {
	console.log(chalk.green("System informations:"));
	console.log(chalk.bold(`\tOS Version: ${os.version()}`));
	console.log(chalk.bold(`\tNodeJS version: ${process.version}`));

	getInfosFromPackage();
};

export { infoForm };

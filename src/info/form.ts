import chalk from "chalk";
import path from "path";
import fs from "fs";
import os from "os";

function getInfosFromPackage() {
	try {
			// Get the absolute path of the input directory parameter
		const absDirPath = path.resolve();
		// Load the package.json file
		const packageJsonPath = path.join(absDirPath, "package.json");

		const fileContents = fs.readFileSync(packageJsonPath, "utf-8");
		const packageJson = JSON.parse(fileContents);

		console.log(chalk.green("ExpressoTS Project:"));
		console.log(chalk.bold(`	Name: ${packageJson.name}`));
		console.log(chalk.bold(`	Description: ${packageJson.description}`));
		console.log(chalk.bold(`	Version: ${packageJson.version}`));
		console.log(chalk.bold(`	Author: ${packageJson.author}`));
	} catch (error) {
		console.log(chalk.green("ExpressoTS Project:"));
		console.log(chalk.bold("	package.json not found!"));
	}
}

const infoForm = async (): Promise<void> => {
	console.log(chalk.green("System informations:"));
	console.log(chalk.bold(`	OS Version: ${os.version()}`));
	console.log(chalk.bold(`	NodeJS version: ${process.version}`));

	getInfosFromPackage();
};

export { infoForm };

import chalk from "chalk";
import CliTable3 from "cli-table3";

const helpForm = async (): Promise<void> => {
	const table = new CliTable3({
		head: [
			chalk.green("Name"),
			chalk.green("Alias"),
			chalk.green("Description"),
		],
		colWidths: [15, 15, 60],
	});

	table.push(
		["new project", "new", "Generate a new project"],
		["info", "i", "Provides project information"],
		["resources", "r", "Displays cli commands and resources"],
		["scripts", "scripts", "Run scripts list or specific scripts"],
		["help", "h", "Show command help"],
		[
			"service",
			"g s",
			"Generate a service [controller, usecase, dto, module]",
		],
		["controller", "g c", "Generate a controller"],
		["usecase", "g u", "Generate a usecase"],
		["dto", "g d", "Generate a dto"],
		["entity", "g e", "Generate an entity"],
		["provider", "g p", "Generate internal provider"],
		[
			"provider",
			"add",
			"Add provider to the project. Use -d to add as dev dependency",
		],
		["provider", "remove", "Remove provider from the project"],
		["provider", "create", "Create external provider"],
		["module", "g mo", "Generate a module"],
		["middleware", "g mi", "Generate a middleware"],
	);
	console.log(
		chalk.bold.white("ExpressoTS:", `${chalk.green("Resources List")}`),
	);
	console.log(chalk.whiteBright(table.toString()));
	console.log(
		chalk.bold.white(
			`📝 More info: ${chalk.green(
				"https://doc.expresso-ts.com/docs/category/cli",
			)}`,
		),
	);
	console.log("\n");
};

export { helpForm };

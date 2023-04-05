import "../utils/string";
import * as nodePath from "path";
import Compiler from "../utils/compiler";
import { mkdirSync, readFileSync } from "node:fs";
import { Pattern } from "../types";
import { toCamelCase, toKebabCase, toPascalCase } from "../utils/string";
import { render } from "mustache";
import { writeFileSync, existsSync } from "fs";
import chalk from "chalk";

type CreateTemplateProps = {
	schematic: string;
	path: string;
};

const messageColors = {
	usecase: (text: string) => chalk.cyan(text),
	controller: (text: string) => chalk.magenta(text),
	dto: (text: string) => chalk.blue(text),
	provider: (text: string) => chalk.yellow(text),
	module: (text: string) => chalk.red(text),
} as { [key: string]: (text: string) => string }

export const createTemplate = async ({
	schematic,
	path: target,
}: CreateTemplateProps) => {
	const withinSource = schematicFolder(schematic);
	if (!withinSource) return;

	const { path, file, className } = await splitTarget({ target, schematic });

	const { sourceRoot } = await Compiler.loadConfig();

	const usecaseDir = `${sourceRoot}/${withinSource}`;

	mkdirSync(`${usecaseDir}/${path}`, { recursive: true });

	if (schematic !== "service") {
		console.log(messageColors[schematic](`> [${schematic}] Creating ${file}...`));

		writeTemplate({
			outputPath: `${usecaseDir}/${path}${file}`,
			template: {
				path: `./templates/${schematic}.tpl`,
				data: { className },
			},
		});
	} else {
		for await (const currentSchematic of ["controller", "usecase", "dto"]) {
			const schematicFile = file.replace(
				`controller.ts`,
				`${currentSchematic}.ts`,
			);

			console.log(messageColors[currentSchematic](`> [${currentSchematic}] Creating ${schematicFile}...`));

			writeTemplate({
				outputPath: `${usecaseDir}/${path}${schematicFile}`,
				template: {
					path: `./templates/${currentSchematic}.tpl`,
					data: {
						className,
					},
				},
			});
		}
	}

	const moduleName = path.split("/")[0];

	if (["controller", "service"].includes(schematic) && !existsSync(`${usecaseDir}/${moduleName}/${moduleName}.module.ts`)) {
		console.log(messageColors.module(`> [module] Creating ${moduleName}.module.ts...`));

		writeTemplate({
			outputPath: `${usecaseDir}/${moduleName}/${moduleName}.module.ts`,
			template: {
				path: `./templates/module.tpl`,
				data: {
					moduleName: moduleName[0].toUpperCase() + moduleName.slice(1),
					className,
					path: `${path.split("/")[1]}/${file}`
				},
			},
		});
	}
};

const writeTemplate = ({
	outputPath,
	template: { path, data },
}: {
	outputPath: string;
	template: {
		path: string;
		data: Record<string, string>;
	};
}) => {
	writeFileSync(
		outputPath,
		render(readFileSync(nodePath.join(__dirname, path), "utf8"), data),
	);
};

const schematicFolder = (schematic: string): string | undefined => {
	switch (schematic) {
		case "usecase":
			return "useCases";
		case "controller":
			return "useCases";
		case "dto":
			return "useCases";
		case "service":
			return "useCases";
		case "provider":
			return "providers";
	}

	return undefined;
};

const splitTarget = async ({
	target,
	schematic,
}: {
	target: string;
	schematic: string;
}): Promise<{
	path: string;
	file: string;
	className: string;
}> => {
	if (schematic === "provider")
		return await splitTargetProviderEdgeCase({ target, schematic });

	if (schematic === "service") schematic = "controller"; // Anything just to generate

	// 1. Extract the name (first part of the target)
	const [name, ...remainingPath] = target.split("/");

	// 2. Check if the name is camelCase or kebab-case
	const camelCaseRegex = /[A-Z]/;
	const kebabCaseRegex = /[_\-\s]+/;

	const isCamelCase = camelCaseRegex.test(name);
	const isKebabCase = kebabCaseRegex.test(name);

	if (isCamelCase || isKebabCase) {
		const [wordName, ...path] = name
			?.split(isCamelCase ? /(?=[A-Z])/ : kebabCaseRegex)
			.map((word) => word.toLowerCase());

		return {
			path: `${wordName}/${pathEdgeCase(path)}${pathEdgeCase(remainingPath)}`,
			file: `${await getNameWithScaffoldPattern(name)}.${schematic}.ts`,
			className: toPascalCase(name),
		};
	}

	// 3. Return the base case
	return {
		path: `${name}/${pathEdgeCase(remainingPath)}`,
		file: `${await getNameWithScaffoldPattern(name)}.${schematic}.ts`,
		className: toPascalCase(name),
	};
};

const splitTargetProviderEdgeCase = async ({
	target,
	schematic,
}: {
	target: string;
	schematic: string;
}): Promise<{
	path: string;
	file: string;
	className: string;
}> => {
	// Check if the last path ends with a slash, if it does it's supposed to be a folder
	// and the name of the file will be the same as the folder
	const isFolder = target.endsWith("/");
	const path = target.split("/").slice(0, -1);
	const name = isFolder
		? path[path.length - 1]
		: target.split("/")[target.split("/").length - 1];

	return {
		path: pathEdgeCase(path),
		file: `${await getNameWithScaffoldPattern(name)}.${schematic}.ts`,
		className: toPascalCase(name),
	};
};

const getNameWithScaffoldPattern = async (name: string) => {
	const configObject = await Compiler.loadConfig();

	switch (configObject.scaffoldPattern) {
		case Pattern.LOWER_CASE:
			return name.toLowerCase();
		case Pattern.KEBAB_CASE:
			return toKebabCase(name);
		case Pattern.PASCAL_CASE:
			return toPascalCase(name);
		case Pattern.CAMEL_CASE:
			return toCamelCase(name);
	}
};

const pathEdgeCase = (path: string[]): string => {
	return `${path.join("/")}${path.length > 0 ? "/" : ""}`;
};

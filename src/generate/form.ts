import { Pattern } from "../types";
import Config from "../utils/expresso-config";
import "../utils/string";
import { toCamelCase, toKebabCase, toPascalCase } from "../utils/string";

type CreateTemplateProps = {
	schematic: string;
	path: string;
};

export const createTemplate = ({
	schematic,
	path: target,
}: CreateTemplateProps) => {
	const withinSource = schematicFolder(schematic);
	if (!withinSource) return;

	const { path, file } = splitTarget({ target, schematic });

	console.log(path, file);
	console.log(`> src/${withinSource}/${path}${file}`);
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

const splitTarget = ({
	target,
	schematic,
}: {
	target: string;
	schematic: string;
}): {
	path: string;
	file: string;
} => {
	if (schematic === "provider")
		return splitTargetProviderEdgeCase({ target, schematic });

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
			file: `${getNameWithScaffoldPattern(name)}.${schematic}.ts`,
		};
	}

	// 3. Return the base case
	return {
		path: `${name}/${pathEdgeCase(remainingPath)}`,
		file: `${getNameWithScaffoldPattern(name)}.${schematic}.ts`,
	};
};

const splitTargetProviderEdgeCase = ({
	target,
	schematic,
}: {
	target: string;
	schematic: string;
}): {
	path: string;
	file: string;
} => {
	// Check if the last path ends with a slash, if it does it's supposed to be a folder
	// and the name of the file will be the same as the folder
	const isFolder = target.endsWith("/");
	const path = target.split("/").slice(0, -1);
	const name = isFolder
		? path[path.length - 1]
		: target.split("/")[target.split("/").length - 1];

	return {
		path: pathEdgeCase(path),
		file: `${getNameWithScaffoldPattern(name)}.${schematic}.ts`,
	};
};

const getNameWithScaffoldPattern = (name: string) => {
	const {
		config: { scaffoldPattern },
	} = Config.getConfig();

	switch (scaffoldPattern) {
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

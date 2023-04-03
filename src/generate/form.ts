import "../utils/string";
import path from "path";

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

function interopRequireDefault(obj: any): any {
  return obj && obj.__esModule ? obj : {default: obj};
}

const loadTSConfigFile = async (
  configPath: string,
): Promise<any> => {
  // Get registered TypeScript compiler instance
  const registeredCompiler = await getRegisteredCompiler();

  registeredCompiler.enabled(true);

  let configObject = interopRequireDefault(require(configPath)).default;

  // In case the config is a function which imports more Typescript code
  if (typeof configObject === 'function') {
    configObject = await configObject();
  }

  registeredCompiler.enabled(false);

  return configObject;
};

let registeredCompilerPromise: Promise<any>;

function getRegisteredCompiler() {
  // Cache the promise to avoid multiple registrations
  registeredCompilerPromise = registeredCompilerPromise ?? registerTsNode();
  return registeredCompilerPromise;
}

async function registerTsNode(): Promise<any> {
  try {
    // Register TypeScript compiler instance
    const tsNode = await import('ts-node');
    return tsNode.register({
      compilerOptions: {
        module: 'CommonJS',
      },
      moduleTypes: {
        '**': 'cjs',
      },
    });
  } catch (e: any) {
    if (e.code === 'ERR_MODULE_NOT_FOUND') {
      throw new Error(
        `Jest: 'ts-node' is required for the TypeScript configuration files. Make sure it is installed\nError: ${e.message}`,
      );
    }

    throw e;
  }
}

const getNameWithScaffoldPattern = async (name: string) => {
	const configPath = path.join(process.cwd(), 'expressots.config.ts');

	const configObject = await loadTSConfigFile(configPath);
	console.log(configObject);
};



const pathEdgeCase = (path: string[]): string => {
	return `${path.join("/")}${path.length > 0 ? "/" : ""}`;
};

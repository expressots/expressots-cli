import { CommandModule, Argv } from "yargs";
import { createTemplate } from "./form";

type CommandModuleArgs = {};

const generateProject = (): CommandModule<CommandModuleArgs, any> => {
	return {
		command: "generate [schematic] [path]",
		describe: "Generate a schematic",
		aliases: ["g"],
		builder: (yargs: Argv): Argv => {
			yargs.positional("schematic", {
				choices: [
					"useCase",
					"controller",
					"dto",
					"service",
					"provider",
				] as const,
				describe: "The schematic to generate",
				type: "string",
				coerce: coerceSchematicAliases,
			});

			yargs.positional("path", {
				describe: "The path to generate the schematic",
				type: "string",
			});

			return yargs;
		},
		handler: async ({ schematic, path }) => {
      return await createTemplate({ schematic, path });
		},
	};
};

const coerceSchematicAliases = (arg: string) => {
	switch (arg) {
		case "u":
			return "useCase";
		case "c":
			return "controller";
		case "d":
			return "dto";
		case "s":
			return "service";
		case "p":
			return "provider";
		default:
			return arg;
	}
};

export { generateProject };

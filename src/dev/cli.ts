import { CommandModule } from "yargs";
import { projectForm } from "./form";
import { CommandDevArgs } from "../@types";

const devProject = (): CommandModule<Record<string, never>, CommandDevArgs> => {
	return {
		command: "dev",
		describe: "Run project in development mode",
		handler: projectForm,
	};
};

export { devProject };

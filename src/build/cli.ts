import { CommandModule } from "yargs";
import { projectForm } from "./form";
import { CommandDevArgs } from "../@types";

const buildProject = (): CommandModule<Record<string, never>, CommandDevArgs> => {
	return {
		command: "build",
		describe: "Build project",
		handler: projectForm,
	};
};

export { buildProject };

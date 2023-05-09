import { CommandModule } from "yargs";
import { infoForm } from "./form";

// eslint-disable-next-line @typescript-eslint/ban-types
type CommandModuleArgs = {};

const infoProject = (): CommandModule<CommandModuleArgs, any> => {
	return {
		command: "info",
		describe: "Displays information about the ExpressoTS project",
		aliases: ["i"],
		handler: async () => {
      await infoForm();
		},
	};
};

export { infoProject };

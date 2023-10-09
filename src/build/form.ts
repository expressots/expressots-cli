/* eslint-disable @typescript-eslint/no-var-requires */
import path from "node:path";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { CommandBuildArgs } from "../@types";
import { printError } from "../utils/cli-ui";
import { getPlatformCommand } from "../utils/get-platform-command-bin";

const PATH = `${process.env.PATH}${path.delimiter}${path.resolve(__dirname, "../../node_modules/.bin")}`;
const env = { ...process.env, PATH };

const projectForm = async ({ experimental }: CommandBuildArgs): Promise<void> => {
	console.time("Build succeed");

	spawnSync("rimraf", ["dist"], { env, stdio: "inherit" });

	if (experimental) {
		if (!existsSync(".swcrc")) {
			printError("Experimental features needs .swcrc file", ".swcrc");
			process.exit(1);
		}

		const { result } = require("concurrently")([
			{ name: "types", command: "tsc --noEmit" },
			{ name: "lint", command: "eslint src/**/*.ts" },
			{ name: "build", command: "swc src -d dist" },
		], { raw: true });
		
		result
			.then(() => {
				console.timeEnd("Build succeed");
			})
			.catch(() => {
				printError("Build failed", "expressots build");
				process.exit(1);
			});

		return;
	}

	spawnSync(getPlatformCommand("tsc"), ["-p", "tsconfig.build.json"], { env, stdio: "inherit" });
	console.timeEnd("Build succeed");
};

export { projectForm };

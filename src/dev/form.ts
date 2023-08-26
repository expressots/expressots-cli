/* eslint-disable @typescript-eslint/no-var-requires */
import path from "node:path";
import { existsSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import nodemon from "nodemon";
import { CommandDevArgs } from "../@types";
import { printError } from "../utils/cli-ui";
import { getPlatformCommand } from "../utils/get-platform-command-bin";

const projectForm = async ({ experimental }: CommandDevArgs): Promise<void> => {
	if (experimental) {
		if (!existsSync(".swcrc")) {
			printError("Experimental features needs .swcrc file", ".swcrc");
			process.exit(1);
		}

		require('@swc/register');

		function nodemonRestart() {
			spawn(getPlatformCommand("eslint"), ["src/**/*.ts"], { stdio: "inherit" });
			spawn(getPlatformCommand("tsc"), ["--noEmit"], { stdio: "inherit" });
		}

		nodemon({
			ext: "ts",
			exec: `node -r ${require.resolve("@swc/register")} src/main.ts`,
		})
			.on("start", nodemonRestart)
			.on("restart", nodemonRestart);
		

		return;
	}

	spawnSync(getPlatformCommand("ts-node-dev"), ["src/main.ts"], { stdio: "inherit" });
};

export { projectForm };

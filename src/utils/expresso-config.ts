// Store the config in a global variable so that it can be accessed from anywhere
// without having to pass it around. It is initialized in the main function.
// And it's loaded from the file `expressots.config.ts` in the root of the project.

// Path: src/utils/expresso-config.ts
import { ExpressoConfig } from "../types";
import { existsSync } from "fs";
import { join } from "path";

class Config {
	private static instance: Config;
	private config: ExpressoConfig;

	private constructor() {
		this.config = this.loadConfig();
	}

	public static getInstance(): Config {
		if (!Config.instance) {
			Config.instance = new Config();
		}

		return Config.instance;
	}

	public getConfig(): ExpressoConfig {
		return this.config;
	}

	private loadConfig(): ExpressoConfig {
		const configPath = join(process.cwd(), "expressots.config.ts");

		if (!existsSync(configPath)) throw new Error("Config file not found");

		const config = require(configPath);

		return config;
	}
}

export default Config.getInstance();

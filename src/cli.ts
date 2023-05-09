#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { generateProject } from "./generate";
import { createProject } from "./new";
import { infoProject } from "./info";

yargs(hideBin(process.argv))
	.scriptName("expressots")
	.example("$0 new <project-name>", "Create a new Expresso TS project")
	.command(createProject())
	.command(generateProject())
	.command(infoProject())
	.demandCommand(1, "You need at least one command before moving on")
	.epilog("For more information, visit https://expresso-ts.com")
	.alias("h", "help")
	.alias("v", "version")
	.help()
	.wrap(140)
	.parse();

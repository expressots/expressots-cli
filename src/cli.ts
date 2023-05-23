#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { generateProject } from "./generate";
import { infoProject } from "./info";
import { createProject } from "./new";

export const CLI_VERSION = "1.2.2";

yargs(hideBin(process.argv))
	.scriptName("expressots")
	.command(createProject())
	.command(generateProject())
	.command(infoProject())
	.example("[new]: $0 new expressots-demo", "Create interactively")
	.example("[new]: $0 new expressots-demo -t opinionated -p yarn", "Create project silently")
	.example("[generate]: $0 generate service user-create", "Generate a project service")
	.example("[info]: $0 info", "Show CLI details")
	.demandCommand(1, "You need at least one command before moving on")
	.epilog("For more information: \n" +
	"🌐 visit https://expresso-ts.com\n" +
	"💖 Sponsor: https://github.com/sponsors/expressots")
	.help("help", "Show command help")
	.alias("h", "help")
	.version(false)
	.wrap(140)
	.parse();
import { TemplateEnum, Template } from "./@types";

const stable: Template[] = [
	{
		name: TemplateEnum.OPINIONATED,
		description: "Non-Opinionated :: A simple ExpressoTS project.",
		path: "expressots/expressots/templates/non_opinionated",
	},
	{
		name: TemplateEnum.NON_OPINIONATED,
		description: "Opinionated :: A complete ExpressoTS project with an opinionated structure and features.",
		path: "expressots/expressots/templates/opinionated",
	},
];

const experimental: Template[] = [
	{
		name: TemplateEnum.OPINIONATED,
		description: "Non-Opinionated :: EXPERIMENTAL BUILD - A simple ExpressoTS project.",
		path: "expressots/expressots/templates/experimental/non_opinionated",
	},
	{
		name: TemplateEnum.NON_OPINIONATED,
		description:
			"Opinionated :: EXPERIMENTAL BUILD - A complete ExpressoTS project with an opinionated structure and features.",
		path: "expressots/expressots/templates/experimental/opinionated",
	},
];

export default { stable, experimental };

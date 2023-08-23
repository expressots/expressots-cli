export enum TemplateEnum {
    OPINIONATED = "opinionated",
    NON_OPINIONATED = "non-opinionated"
}

export interface Template {
	name: TemplateEnum;
	description: string;
	path: string;
}
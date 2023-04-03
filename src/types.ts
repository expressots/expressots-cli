enum Pattern {
	LOWER_CASE = "lowercase",
	KEBAB_CASE = "kebab-case",
	PASCAL_CASE = "PascalCase",
	CAMEL_CASE = "camelCase",
}

interface Config {
	src: string;
	pattern: string;
}

export { Pattern, Config }

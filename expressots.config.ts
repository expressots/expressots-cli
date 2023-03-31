enum Pattern {
	LOWER_CASE = "lowercase",
	KEBAB_CASE = "kebab-case",
	PASCAL_CASE = "PascalCase",
	CAMEL_CASE = "camelCase",
}

const config = {
	scaffoldPattern: Pattern.KEBAB_CASE,
	sourceRoot: "src",
	opinionated: true,
};

export { config };

enum Pattern {
	LOWER_CASE = "lowercase",
	KEBAB_CASE = "kebab-case",
	PASCAL_CASE = "PascalCase",
	CAMEL_CASE = "camelCase",
}

type ExpressoConfig = {
	config: {
		scaffoldPattern: Pattern;
		sourceRoot: string;
		opinionated: boolean;
	};
};

export { Pattern, ExpressoConfig };

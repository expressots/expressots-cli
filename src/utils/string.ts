// Create string overload for the functions toPascalCase and toKebabCase
const toPascalCase = (str: string): string => {
	// If the string is kebab-case, convert it to camelCase first
	if (str.includes("-")) {
		str = str
			.split("-")
			.map((word, index) => {
				return index === 0
					? word.toLowerCase()
					: word.charAt(0).toUpperCase() + word.slice(1);
			})
			.join("");
	}

	return str
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join("");
};


// pipe results to dev/null to prevent the output from being logged
// yarn build && yarn start generate controller user-create 2&> /dev/null

// bat srcDebug/useCases/user/create/user-create.controller.ts

const toKebabCase = (str: string): string => {
	return str
		.split(" ")
		.map((word) => word.toLowerCase())
		.join("-");
};

const toCamelCase = (str: string): string => {
	return str
		.split(" ")
		.map((word, index) => {
			return index === 0
				? word.toLowerCase()
				: word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join("");
};

const toLowerCase = (str: string): string => {
	return str
		.toLowerCase()
		.split(" ")
		.join("");
};

export { toPascalCase, toKebabCase, toCamelCase, toLowerCase };

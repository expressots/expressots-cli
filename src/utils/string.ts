// Create string overload for the functions toPascalCase and toKebabCase
const toPascalCase = (str: string): string => {
	return str
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join("");
};

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

export { toPascalCase, toKebabCase, toCamelCase };

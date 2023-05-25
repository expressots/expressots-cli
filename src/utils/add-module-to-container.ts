import fs from 'node:fs';
import Compiler from './compiler';
import chalk from 'chalk';

async function addModuleToContainer(name: string) {
	const moduleName = name[0].toUpperCase() + name.slice(1);
	const {opinionated} = await Compiler.loadConfig();

	let usecaseDir: string;
	if (opinionated) {
		usecaseDir = `@useCases/`;
	} else {
		usecaseDir = "./";
	}

  const fileContent = await fs.promises.readFile('./src/app-container.ts', 'utf8');

  const imports: string[] = [];
  const notImports: string[] = [];

  fileContent.split('\n').forEach((line: string) => {
    if (line.startsWith('import')) {
      imports.push(line);
    } else {
      notImports.push(line);
    }
  });

	const newImport = `import { ${moduleName}Module } from "${usecaseDir}${name}/${name}.module.ts";`;

	if (imports.includes(newImport)) {
		return;
	}

	console.log(chalk.red(`> [Container] Adding module "${moduleName}Module" to app-container.ts...`));
  imports.push(newImport);

  const moduleDeclarationRegex = /appContainer.create\(\s*\[([\s\S]*?)]/;
  const moduleDeclarationMatch = fileContent.match(moduleDeclarationRegex);

  if (!moduleDeclarationMatch) {
    return;
  }

  const modules = moduleDeclarationMatch[1].trim().split(',').map((c) => c.trim());

  if (modules.includes(moduleName)) {
    return;
  }

  modules.push(`${moduleName}Module`);

  const newModule = modules.join(', ');

  const newModuleDeclaration = `appContainer.create([${newModule}]`;

  const newFileContent = [...imports, ...notImports].join('\n').replace(moduleDeclarationRegex, newModuleDeclaration);

  await fs.promises.writeFile('./src/app-container.ts', newFileContent, 'utf8');
}

export { addModuleToContainer };

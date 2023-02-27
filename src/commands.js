const { program } = require('commander');

const path = require('path');
const convert = require('./convert');

program.arguments('<svgPath>').action((svgPath) => {
	const folders = svgPath.split('/');
	convert(
		path.join(process.cwd(), svgPath),
		path.join(process.cwd(), `./src/components/${folders.at(-1)}`)
	);
});

module.exports = program;

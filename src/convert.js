const fs = require('fs');
const { readdirSync, readFileSync, rmSync, writeFileSync, lstatSync } = require('fs');
const path = require('path');

const attributes = ['width', 'height', 'fill', 'stroke', 'stroke-width', 'opacity'];

function write(file, svg, defaultProps) {
	writeFileSync(file, createComponent(svg, defaultProps));
}

function createDirectory(target) {
	if (!fs.existsSync(target)) {
		fs.mkdirSync(target, { recursive: true });
	}
}

function getSvgTag(svg) {
	const regex = /<svg[\s\S]*<\/svg>/gu;
	const svgTag = svg.match(regex);
	if (svgTag) {
		return svgTag[0];
	}
	return null;
}

function extractAttributes(svgTag) {
	const values = [];
	for (let index = 0; index < attributes.length; index += 1) {
		const attribute = attributes[index];
		const regexString = `(?<=\\s)(${attribute}="[^"]*")`;

		let regex = new RegExp(regexString, 'gu');

		if (attribute == 'width' || attribute == 'height') {
			regex = new RegExp(regexString, 'u');
		}

		const matches = svgTag.match(regex);

		if (matches) {
			const value = matches[0].split('=')[1];
			values.push(value);

			svgTag = svgTag.replace(
				regex,
				`:${attribute}='${attribute.replace('-', '')} ? ${attribute.replace('-', '')}: ${value}'`
			);
		} else {
			values.push(null);
			// If tag already don't have the properties, add the newProperties to the svg
			svgTag = `${svgTag.slice(0, 4)} :${attribute}='${attribute.replace('-', '')}' ${svgTag.slice(
				4
			)}`;
		}
	}

	return { newSvgTag: svgTag, values };
}

function createComponent(svg, values) {
	return `<template>
	<span :style="{fill: fill ? fill : undefined, width: width ? width : undefined, height: height ? height : undefined}">${svg}</span>
	
</template>

<script>
export default {
  props: {
	width:{type:String,default:undefined},
    height: {type:String,default:'100%'},
    fill: {type:String,default:undefined},
    stroke: {type:String,default:${values[3] ?? "'none'"}},
    strokewidth:{type:String,default:${values[4] ?? "'1'"}},
    opacity:{type:String,default:${values[5] ?? "'1'"}},
  },
};
</script>

`;
}
function convert(svgPath, target) {
	// Create Target Directory
	createDirectory(target);
	const dirs = readdirSync(svgPath);

	// Loop through directories

	for (let index = 0; index < dirs.length; index += 1) {
		const fullDir = path.join(svgPath, dirs[index]);
		if (lstatSync(fullDir).isDirectory()) {
			const subTarget = path.join(target, dirs[index]);
			convert(fullDir, subTarget);
		} else {
			// Read the svg
			const content = readFileSync(fullDir, 'utf-8').toString();
			const svgTag = getSvgTag(content);

			if (svgTag) {
				const { newSvgTag, values } = extractAttributes(svgTag);
				const fileName =
					dirs[index].split('.')[0][0].toUpperCase() + dirs[index].split('.')[0].slice(1);
				write(`${target}/${fileName}Svg.vue`, newSvgTag, values);
			}
		}
	}
}

function handle(svgPath, target) {
	try {
		if (!fs.existsSync(svgPath)) {
			throw new Error(`No such file or directory ${svgPath}`);
		} else if (fs.existsSync(target)) {
			// Remove for overriding
			rmSync(target, { recursive: true });
		}
		convert(svgPath, target);
	} catch (error) {
		console.log(error.message);
	}
}

module.exports = handle;

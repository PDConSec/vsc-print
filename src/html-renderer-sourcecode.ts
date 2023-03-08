import { IResourceDescriptor } from './IResourceDescriptor';
import * as vscode from 'vscode';
import { logger } from './logger';
import hljs = require('highlight.js');
import * as path from "path";

const resources = new Map<string, IResourceDescriptor>();
resources.set("default.css", {
	content: require("highlight.js/styles/default.css").default.toString(),
	mimeType: "text/css; charset=utf-8;"
});
resources.set("line-numbers.css", {
	content: require("./css/line-numbers.css").default.toString(),
	mimeType: "text/css; charset=utf-8;"
});

export function getBodyHtml(raw: string, languageId: string, options?: any): string {
	let renderedCode = "";
	try {
		try {
			renderedCode = hljs.highlight(raw, { language: languageId }).value;
			if (!renderedCode.includes('"hljs-keyword"')) {
				logger.warn(`Language identifier "${languageId}" could not be honoured. Autodetecting.`);
				renderedCode = hljs.highlightAuto(raw).value;
			}
		}
		catch (err) {
			logger.warn(`Language identifier "${languageId}" could not be honoured. Autodetecting.`);
			renderedCode = hljs.highlightAuto(raw).value;
		}
		if (languageId === "css") {
			renderedCode = addCssColourSwatches(renderedCode);
		}
		renderedCode = fixMultilineSpans(renderedCode);
		const printConfig = vscode.workspace.getConfiguration("print");
		const bpre = /([^ -<]{40}|\)\]\},)/g;
		if (printConfig.lineNumbers === "on") {
			renderedCode = renderedCode
				.split("\n")
				.map(line => line || "&nbsp;")
				.map((line, i) => `<tr><td class="line-number">${options.startLine + i}</td><td class="line-text">${line.replace(bpre, "$1<wbr>")}</td></tr>`)
				.join("\n")
				.replace("\n</td>", "</td>")
				;
		} else {
			renderedCode = renderedCode
				.split("\n")
				.map(line => line || "&nbsp;")
				.map((line, i) => `<tr><td class="line-text">${line.replace(bpre, "$1<wbr>")}</td></tr>`)
				.join("\n")
				.replace("\n</td>", "</td>")
				;
		}
	} catch (err) {
		logger.error(`Markdown could not be rendered\n${err}`);
		renderedCode = "<div>Could not render this file.</end>";
	}
	return `${options.filepathTitle}<table class="hljs">\n${renderedCode}\n</table>`;
}

export function getCssUriStrings(): Array<string> {
	return [
		"bundled/default.css",
		"bundled/line-numbers.css",
		"bundled/colour-scheme.css",
		"bundled/settings.css",
	];
}

export function getResource(name: string): IResourceDescriptor {
	return resources.get(name)!;
}

function fixMultilineSpans(text: string): string {
	let classes: string[] = [];

	// since this code runs on simple, well-behaved, escaped HTML, we can just
	// use regex matching for the span tags and classes

	// first capture group is if it's a closing tag, second is tag attributes
	const spanRegex = /<(\/?)span(.*?)>/g;
	// https://stackoverflow.com/questions/317053/regular-expression-for-extracting-tag-attributes
	// matches single html attribute, first capture group is attr name and second is value
	const tagAttrRegex = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/g;

	return text.split("\n").map(line => {
		const pre = classes.map(classVal => `<span class="${classVal}">`);

		let spanMatch;
		spanRegex.lastIndex = 0; // exec maintains state which we need to reset
		while ((spanMatch = spanRegex.exec(line)) !== null) {
			if (spanMatch[1] !== "") {
				classes.pop();
				continue;
			}
			let attrMatch;
			tagAttrRegex.lastIndex = 0;
			while ((attrMatch = tagAttrRegex.exec(spanMatch[2])) !== null) {
				if (attrMatch[1].toLowerCase().trim() === "class") {
					classes.push(attrMatch[2]);
				}
			}
		}

		return `${pre.join("")}${line}${"</span>".repeat(classes.length)}`;
	}).join("\n");
}

export function getTitle(uri:vscode.Uri):string {
	const printConfig = vscode.workspace.getConfiguration("print");
	let filename = uri.fsPath;
	const parts = filename.split(path.sep);
	switch (printConfig.filepathInDocumentTitle) {
		case "No path":
			return parts[parts.length - 1];
		case "Abbreviated path":
			if (parts.length > 3) {
				filename = [parts[0], "...", parts[parts.length - 2], parts[parts.length - 1]].join(path.sep);
			}
			return filename;
		case "Workspace relative":
			const wf = vscode.workspace.getWorkspaceFolder(uri);
			if (wf)
				return path.relative(wf.uri.fsPath, filename);
			else
				return uri.fsPath; // it's not IN a workspace 
		default:
			throw "THIS CANNOT HAPPEN";
	}
}

function addCssColourSwatches(text: string): string {
	return text.replace(
		/(:\s*<span class="hljs-number">)([#A-Za-z][A-Za-z0-9]+)/g,
		'$1<svg height="1em" width="1em"><rect width="1em" height="1em" style="fill:$2; stroke:black"/></svg> $2'
	).replace(
		/(<span class="hljs-attribute">.*<\/span>\s*:\s*)(aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|grey|green|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|navyblue|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|powderblue|purple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)(?:\s*);/gm,
		'$1<svg height="1em" width="1em"><rect width="1em" height="1em" style="fill:$2; stroke:black"/></svg> $2'
	);
}

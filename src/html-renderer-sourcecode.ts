import { IResourceDescriptor } from './IResourceDescriptor';
import * as vscode from 'vscode';
import { logger } from './logger';
import hljs = require('highlight.js');

const resources = new Map<string, IResourceDescriptor>();
resources.set("default.css", {
	content: require("highlight.js/styles/default.css").default.toString(),
	mimeType: "text/css; charset=utf-8;"
})
resources.set("default-markdown.css", {
	content: require("./css/default-markdown.css").default.toString(),
	mimeType: "text/css; charset=utf-8;"
});
resources.set("line-numbers.css", {
	content: require("./css/line-numbers.css").default.toString(),
	mimeType: "text/css; charset=utf-8;"
});

export function getBodyHtml(raw: string, languageId: string, options?:any): string {
	let renderedCode = "";
	try {
		try {
			renderedCode = hljs.highlight(raw, { language: languageId }).value;
		}
		catch (err) {
			renderedCode = hljs.highlightAuto(raw).value;
		}
		renderedCode = fixMultilineSpans(renderedCode);
		const printConfig = vscode.workspace.getConfiguration("print");
		if (printConfig.lineNumbers === "on") {
			renderedCode = renderedCode
				.split("\n")
				.map(line => line || "&nbsp;")
				.map((line, i) => `<tr><td class="line-number">${options.startLine + i}</td><td class="line-text">${line.replace(/([^ -<]{40})/g, "$1<wbr>")}</td></tr>`)
				.join("\n")
				.replace("\n</td>", "</td>")
				;
		} else {
			renderedCode = renderedCode
				.split("\n")
				.map(line => line || "&nbsp;")
				.map((line, i) => `<tr><td class="line-text">${line.replace(/([^ -<]{40})/g, "$1<wbr>")}</td></tr>`)
				.join("\n")
				.replace("\n</td>", "</td>")
				;
		}	} catch {
		logger.error("Markdown could not be rendered");
		renderedCode = "<div>Could not render this file.</end>";
	}
	return `<table class="hljs">\n${renderedCode}\n</table>`;
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

function getEmbeddedStyles() {
	let editorConfig = vscode.workspace.getConfiguration("editor");
	return `body{tab-size:${editorConfig.tabSize};}`;
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

		return pre + line + "</span>".repeat(classes.length);
	}).join("\n");
}

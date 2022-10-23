import path = require('path');
import * as vscode from 'vscode';
import { logger } from './logger';

export function getBodyHtml(raw: string) {
	// return getRenderedCode
}

export function getCssUriStringArray(): Array<string> {
	return [
		"vsc-print.resource/default.css",
		"vsc-print.resource/line-numbers.css",
		"vsc-print.resource/colour-scheme.css",
		"vsc-print.resource/settings.css",
	];
}

export function getTitle(uri: vscode.Uri) {
	let result: string = uri.path;
	const parts = result.split(path.sep);
	if (parts.length > 3) {
		result = [parts[0], "...", parts[parts.length - 2], parts[parts.length - 1]].join(path.sep);
	} else {
		result = path.basename(uri.path);
	}
	return result;
}

export function getResource(uri: vscode.Uri): Buffer | string {
	let result = "";
	// todo fetch resources from provider
	return result;
}

function getEmbeddedStyles() {
	let editorConfig = vscode.workspace.getConfiguration("editor");
	return `body{tab-size:${editorConfig.tabSize};}`;
}

function getRenderedCode(code: string, languageId: string): string {
	const printConfig = vscode.workspace.getConfiguration("print");
	let renderedCode = "";
	try {
		try {
			renderedCode = hljs.highlight(code, { language: languageId }).value;
		}
		catch (err) {
			renderedCode = hljs.highlightAuto(code).value;
		}
		renderedCode = fixMultilineSpans(renderedCode);
		renderedCode = renderedCode
			.split("\n")
			.map(line => line || "&nbsp;")
			.map((line, i) => `<tr><td class="line-text">${line.replace(/([^ -<]{40})/g, "$1<wbr>")}</td></tr>`)
			.join("\n")
			.replace("\n</td>", "</td>")
			;
	} catch {
		logger.error("Markdown could not be rendered");
		renderedCode = "<div>Could not render this file.</end>";
	}
	return renderedCode;
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

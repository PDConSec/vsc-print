import { logger } from './logger';
import braces = require('braces');
import hljs = require('highlight.js');
import path = require('path');
import * as vscode from 'vscode';
import { localise } from './imports';

const templateFolderItem = require("./template-folder-item.html").default.toString();
const template: string = require("./template.html").default.toString();

export class PageBuilder {
	static MarkdownEngine: any;
	constructor(
		public filename: string,
		public code: string = "",
		public language: string = "",
		public printLineNumbers: boolean,
		public startLine: number = 1
	) { }
	public async build(): Promise<string> {
		const printConfig = vscode.workspace.getConfiguration("print", null);
		const EMBEDDED_STYLES = this.getEmbeddedStyles();
		if (this.language === "folder") {
			const printConfig = vscode.workspace.getConfiguration("print", null);
			logger.debug(`Printing a folder`);
			const docs = await this.docsInFolder();
			const summary = printConfig.folder.includeFileList ?
				`<h3>${docs.length} files</h3><pre>${docs.map(d => d.fileName).join("\n")}</pre>` :
				`<h3>${docs.length} files</h3><p>(file list disabled)</p>`;
			const msgTooManyFiles = localise("TOO_MANY_FILES");
			const flagTooManyFiles = docs.length > printConfig.folder.maxFiles;
			const composite = flagTooManyFiles ? msgTooManyFiles : docs.map(doc => templateFolderItem
				.replace("$FOLDER_ITEM_TITLE", doc.fileName)
				.replace("$FOLDER_ITEM_CONTENT", () => `<table class="hljs">${this.getRenderedCode(doc.getText(), doc.languageId)}</table>`)
			).join('\n');

			if (flagTooManyFiles) {
				vscode.window.showWarningMessage(msgTooManyFiles);
			}

			return template
				.replace(/\$TITLE/g, path.basename(this.filename))
				.replace("$PRINT_AND_CLOSE", printConfig.printAndClose)
				.replace("$CONTENT", () => `${summary}\n${composite}`) // replacer fn suppresses interpretation of $
				.replace("$DEFAULT_STYLESHEET_LINK",
					'<link href="vsc-print.resource/default.css" rel="stylesheet" />\n' +
					'\t<link href="vsc-print.resource/line-numbers.css" rel="stylesheet" />\n' +
					'\t<link href="vsc-print.resource/colour-scheme.css" rel="stylesheet" />\n' +
					'\t<link href="vsc-print.resource/settings.css" rel = "stylesheet" /> ')
				.replace("$VSCODE_MARKDOWN_STYLESHEET_LINKS", "")
				.replace("$EMBEDDED_STYLES", EMBEDDED_STYLES)
				;
		} else {
			if (printConfig.renderMarkdown && this.language === "markdown") {
				logger.debug(`Printing rendered Markdown`);
				const markdownConfig = vscode.workspace.getConfiguration("markdown", null);
				return template
					.replace(/\$TITLE/g, path.basename(this.filename))
					.replace("$PRINT_AND_CLOSE", printConfig.printAndClose)
					.replace("$CONTENT", () => this.getRenderedCode(this.code, this.language)) // replacer fn suppresses interpretation of $
					.replace("$DEFAULT_STYLESHEET_LINK", '<link href="vsc-print.resource/default-markdown.css" rel="stylesheet" />')
					.replace("$VSCODE_MARKDOWN_STYLESHEET_LINKS", markdownConfig.styles.map((cssFilename: string) => `<link href="${cssFilename}" rel="stylesheet" />`).join("\n"))
					.replace("$EMBEDDED_STYLES", EMBEDDED_STYLES)
					;
			} else {
				logger.debug(`Printing ${this.filename}`);
				return template
					.replace(/\$TITLE/g, path.basename(this.filename))
					.replace("$PRINT_AND_CLOSE", printConfig.printAndClose)
					.replace("$CONTENT", () => `<table class="hljs">${this.getRenderedCode(this.code, this.language)}</table>`) // replacer fn suppresses $
					.replace("$DEFAULT_STYLESHEET_LINK",
						'<link href="vsc-print.resource/default.css" rel="stylesheet" />\n' +
						'\t<link href="vsc-print.resource/line-numbers.css" rel="stylesheet" />\n' +
						'\t<link href="vsc-print.resource/colour-scheme.css" rel="stylesheet" />\n' +
						'\t<link href="vsc-print.resource/settings.css" rel = "stylesheet" /> ')
					.replace("$VSCODE_MARKDOWN_STYLESHEET_LINKS", "")
					.replace("$EMBEDDED_STYLES", EMBEDDED_STYLES)
					;
			}
		}
	}
	getEmbeddedStyles() {
		let editorConfig = vscode.workspace.getConfiguration("editor", null);
		return `body{tab-size:${editorConfig.tabSize};}`;
	}
	getRenderedCode(code: string, languageId: string): string {
		let renderedCode = "";
		try {
			const printConfig = vscode.workspace.getConfiguration("print", null);
			if (printConfig.renderMarkdown && this.language === "markdown") {
				renderedCode = PageBuilder.MarkdownEngine.render(code);
				const v = renderedCode.lastIndexOf("</style>");
				if (v != -1) {
					renderedCode = renderedCode.substring(v + 8);
				}
			} else {
				try {
					renderedCode = hljs.highlight(code, { language: languageId }).value;
				}
				catch (err) {
					renderedCode = hljs.highlightAuto(code).value;
				}
				renderedCode = this.fixMultilineSpans(renderedCode);
				if (this.printLineNumbers) {
					renderedCode = renderedCode
						.split("\n")
						.map(line => line || "&nbsp;")
						.map((line, i) => `<tr><td class="line-number">${this.startLine + i}</td><td class="line-text">${line.replace(/([^ -<]{40})/g, "$1<wbr>")}</td></tr>`)
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
				}
			}
		} catch {
			logger.error("Markdown could not be rendered");
			renderedCode = "<div>Could not render this file.</end>";
		}
		return renderedCode;
	}
	fixMultilineSpans(text: string): string {
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
	Utf8ArrayToStr(array: Uint8Array): string {
		var out, i, len, c;
		var char2, char3;
		out = "";
		len = array.length;
		i = 0;
		while (i < len) {
			c = array[i++];
			switch (c >> 4) {
				case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
					// 0xxxxxxx
					out += String.fromCharCode(c);
					break;
				case 12: case 13:
					// 110x xxxx   10xx xxxx
					char2 = array[i++];
					out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
					break;
				case 14:
					// 1110 xxxx  10xx xxxx  10xx xxxx
					char2 = array[i++];
					char3 = array[i++];
					out += String.fromCharCode(((c & 0x0F) << 12) |
						((char2 & 0x3F) << 6) |
						((char3 & 0x3F) << 0));
					break;
			}
		}
		return out;
	}
	async docsInFolder(): Promise<vscode.TextDocument[]> {
		logger.debug(`Enumerating the files in ${this.filename}`);
		const printConfig = vscode.workspace.getConfiguration("print", null);
		// findFile can't cope with nested brace lists in globs but we can flatten them using the braces package
		let excludePatterns: string[] = printConfig.folder.exclude || [];
		if (excludePatterns.length == 0) {
			excludePatterns.push("**/{data,node_modules,out,bin,obj,.*},**/*.{bin,dll,exe,hex,pdb,pdf,pfx,jpg,jpeg,gif,png,bmp,design}");
		}
		let includePatterns: string[] = printConfig.folder.include || [];
		if (includePatterns.length == 0) {
			includePatterns.push("**/*");
		}
		// one item should not be surrounded with braces, they would be treated as literals
		// but flatten them anyway in case the single pattern contains nested braces
		let excludes: string = excludePatterns.length == 1 ? excludePatterns[0] : `{${excludePatterns.join(",")}}`;
		excludePatterns = braces.expand(excludes); //no braces in patterns
		excludes = excludePatterns.length == 1 ? excludePatterns[0] : `{${excludePatterns.join(",")}}`;
		let includes: string = includePatterns.length == 1 ? includePatterns[0] : `{${includePatterns.join(",")}}`;
		includePatterns = braces.expand(includes);
		includes = includePatterns.length == 1 ? includePatterns[0] : `{${includePatterns.join(",")}}`;

		let rel = new vscode.RelativePattern(this.filename, includes);
		const maxLineCount = printConfig.folder.maxLines;
		const matcher = (document: vscode.TextDocument): boolean => document.lineCount < maxLineCount;
		let fileUris = await vscode.workspace.findFiles(rel, excludes);
		logger.debug(`Includes: ${includes}`);
		logger.debug(`Excludes: ${excludes}`);
		const docOpenSettlements = await Promise.allSettled(fileUris.map(uri => vscode.workspace.openTextDocument(uri)));
		const docs = await docOpenSettlements
			.filter(dos => dos.status === "fulfilled")
			.map(dos => (dos as PromiseFulfilledResult<vscode.TextDocument>).value);
		logger.debug(`Eligible: ${fileUris.length} files\n${docs.map(doc => doc.uri.fsPath).join("\n")}`);

		return docs.filter(doc => matcher(doc)).sort((a, b) => {
			const A = a.fileName;
			const B = b.fileName;
			return A < B ? -1 : A > B ? 1 : 0;
		});
	}
}

import { logger } from './logger';
import braces = require('braces');
import path = require('path');
import * as vscode from 'vscode';
import { localise } from './imports';
import { DocumentRenderer } from './document-renderer';

const templateFolderItem = require("./template-folder-item.html").default.toString();
const template: string = require("./template.html").default.toString();

export class HtmlDocumentBuilder {
	static MarkdownEngine: any;
	constructor(
		public filename: string,
		public code: string = "",
		public language: string = "",
		public printLineNumbers: boolean,
		public startLine: number = 1
	) { }
	public async build(): Promise<string> {
		const documentRenderer = DocumentRenderer.get(this.language);
		const printConfig = vscode.workspace.getConfiguration("print");
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
			const composite = flagTooManyFiles ? msgTooManyFiles : docs.map(doc =>
				templateFolderItem
					.replace("FOLDER_ITEM_TITLE", doc.fileName)
					.replace("FOLDER_ITEM_CONTENT", () => `<table class="hljs">${DocumentRenderer.get(doc.languageId).getBodyHtml(doc.getText(), doc.languageId, { startLine: this.startLine })}</table>`)
			).join('\n');

			if (flagTooManyFiles) {
				vscode.window.showWarningMessage(msgTooManyFiles);
			}

			return template
				.replace(/DOCUMENT_TITLE/g, path.basename(this.filename))
				.replace("PRINT_AND_CLOSE", printConfig.printAndClose)
				.replace("CONTENT", () => `${summary}\n${composite}`) // replacer fn suppresses interpretation of $
				.replace("STYLESHEET_LINKS",
					'<link href="bundled/default.css" rel="stylesheet" />\n' +
					'\t<link href="bundled/line-numbers.css" rel="stylesheet" />\n' +
					'\t<link href="bundled/colour-scheme.css" rel="stylesheet" />\n' +
					'\t<link href="bundled/settings.css" rel = "stylesheet" /> ')
				.replace("EMBEDDED_STYLES", EMBEDDED_STYLES)
				;
		} else {
			logger.debug(`Printing ${this.filename}`);
			return template
				.replace(/DOCUMENT_TITLE/g, documentRenderer.getTitle(this.filename))
				.replace("PRINT_AND_CLOSE", printConfig.printAndClose)
				.replace("CONTENT", () => documentRenderer.getBodyHtml(this.code, this.language, {startLine: this.startLine}))
				.replace("STYLESHEET_LINKS", documentRenderer.getCssLinks())
				.replace("EMBEDDED_STYLES", EMBEDDED_STYLES)
				;
		}
	}
	getEmbeddedStyles() {
		let editorConfig = vscode.workspace.getConfiguration("editor", null);
		return `body{tab-size:${editorConfig.tabSize};}`;
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

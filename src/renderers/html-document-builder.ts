import { logger } from '../logger';
import braces from 'braces';
import path = require('path');
import * as vscode from 'vscode';
import { DocumentRenderer } from './document-renderer';
import micromatch = require('micromatch');
import tildify from '../tildify';

const templateFolderItem = require("../templates/folder-item.html").default.toString();
const templateDocument: string = require("../templates/document.html").default.toString();

export class HtmlDocumentBuilder {
	static MarkdownEngine: any;
	private filepath: string;
	constructor(
		public baseUrl: string,
		public uri: vscode.Uri,
		public code: string = "",
		public language: string = "",
		public printLineNumbers: boolean,
		public startLine: number = 1,
		public multiselection: Array<vscode.Uri> = []
	) {
		this.filepath = uri.fsPath;
	}
	public async build(): Promise<string> {
		const documentRenderer = DocumentRenderer.get(this.language);
		const printConfig = vscode.workspace.getConfiguration("print");
		if (this.multiselection!.length) {
			logger.debug(`Selected files`);
			const docs = await this.docsInMultiselection();
			const summary =
				`<h3>${docs.length} printable files</h3><pre>${docs.map(d => printConfig.filepathAsDocumentHeading === "Relative" ? this.workspacePath(d.uri) : tildify(d.fileName)).join("\n")}</pre>\r`;
			const composite = docs.map(doc =>
				templateFolderItem
					.replace("VSCODE_PRINT_FOLDER_ITEM_TITLE", printConfig.filepathAsDocumentHeading === "Relative" ? this.workspacePath(doc.uri) : tildify(doc.fileName))
					.replace("VSCODE_PRINT_FOLDER_ITEM_CONTENT", () => {
						const renderer = DocumentRenderer.get(doc.languageId);
						const bodyText = doc.getText();
						const langId = doc.languageId;
						const options = { startLine: 1, lineNumbers: this.printLineNumbers, uri: this.uri };
						const bodyHtml = renderer.getBodyHtml(bodyText, langId, options);
						return `<table class="hljs">\n${bodyHtml}\n</table>\n`;
					})
			).join('');

			return templateDocument
				.replace("VSCODE_PRINT_BASE_URL", this.baseUrl)
				.replace(/VSCODE_PRINT_DOCUMENT_(?:TITLE|HEADING)/g, "<h2>Selected files</h2>")
				.replace("VSCODE_PRINT_PRINT_AND_CLOSE", printConfig.printAndClose)
				.replace("VSCODE_PRINT_CONTENT", () => `${summary}\n${composite}`) // replacer fn suppresses interpretation of $
				.replace("VSCODE_PRINT_SCRIPT_TAGS", "")
				.replace("VSCODE_PRINT_STYLESHEET_LINKS",
					'<link href="bundled/default.css" rel="stylesheet" />\n' +
					'\t<link href="bundled/line-numbers.css" rel="stylesheet" />\n' +
					'\t<link href="bundled/colour-scheme.css" rel="stylesheet" />\n' +
					'\t<link href="bundled/settings.css" rel = "stylesheet" /> ')
				;
		} else if (this.language === "folder") {
			logger.debug(`Folder ${this.workspacePath(this.uri)}`);
			this.filepath = this.uri.fsPath;
			const docs = await this.docsInFolder();
			const summary = printConfig.folder.includeFileList ?
				`<h3>${docs.length} printable files</h3><pre>${docs.map(d => printConfig.filepathAsDocumentHeading === "Relative" ? this.workspacePath(d.uri) : tildify(d.fileName)).join("\n")}</pre>` :
				`<h3>${docs.length} printable files</h3><p>(file list disabled)</p>`;
			const msgTooManyFiles = vscode.l10n.t("The selected directory contains too many files to print them all. Only the summary will be printed.");
			const flagTooManyFiles = docs.length > printConfig.folder.maxFiles;
			const composite = flagTooManyFiles ? msgTooManyFiles : docs.map(doc =>
				templateFolderItem
					.replace("VSCODE_PRINT_FOLDER_ITEM_TITLE", printConfig.filepathAsDocumentHeading === "Relative" ? this.workspacePath(doc.uri) : tildify(doc.fileName))
					.replace("VSCODE_PRINT_FOLDER_ITEM_CONTENT", () => {
						const renderer = DocumentRenderer.get(doc.languageId);
						const bodyText = doc.getText();
						const langId = doc.languageId;
						const options = { startLine: 1, lineNumbers: this.printLineNumbers, uri: this.uri };
						const bodyHtml = renderer.getBodyHtml(bodyText, langId, options);
						return `<table class="hljs">\n${bodyHtml}\n</table>\n`;
					})
			).join('');

			if (flagTooManyFiles) {
				vscode.window.showWarningMessage(msgTooManyFiles);
			}

			return templateDocument
				.replace("VSCODE_PRINT_BASE_URL", this.baseUrl)
				.replace(/VSCODE_PRINT_DOCUMENT_TITLE/g, this.workspacePath(this.uri))
				.replace(/VSCODE_PRINT_DOCUMENT_HEADING/g, `<h2>Folder ${this.workspacePath(this.uri)}</h2>`)
				.replace("VSCODE_PRINT_PRINT_AND_CLOSE", printConfig.printAndClose)
				.replace("VSCODE_PRINT_CONTENT", () => `${summary}\n${composite}`) // replacer fn suppresses interpretation of $
				.replace("VSCODE_PRINT_SCRIPT_TAGS", "")
				.replace("VSCODE_PRINT_STYLESHEET_LINKS",
					'<link href="bundled/default.css" rel="stylesheet" />\n' +
					'\t<link href="bundled/line-numbers.css" rel="stylesheet" />\n' +
					'\t<link href="bundled/colour-scheme.css" rel="stylesheet" />\n' +
					'\t<link href="bundled/settings.css" rel = "stylesheet" /> ')
				;
		} else {
			logger.debug(`Printing ${this.filepath}`);
			let docHeading = "";
			if (printConfig.filepathHeadingForIndividuallyPrintedDocuments) {
				switch (printConfig.filepathAsDocumentHeading) {
					case "Absolute":
						docHeading = `<h3>${tildify(this.filepath).replace(/([\\/])/g, "$1<wbr />")}</h3>`;
					case "Relative":
						const wf = vscode.workspace.getWorkspaceFolder(this.uri);
						// if no workspace then absolute path
						const relativePath = wf ? path.relative(wf!.uri.fsPath, this.filepath) : this.filepath;
						docHeading = `<h3>${relativePath.replace(/([\\/])/g, "$1<wbr />")}</h3>`;
						break;
				}
			}

			let thePath = "";
			if (printConfig.filepathHeadingForIndividuallyPrintedDocuments)
				switch (printConfig.filepathAsDocumentHeading) {
					case "Absolute":
						thePath = `<h3>${tildify(this.uri.fsPath)}</h3>`;
						break;
					case "Relative":
						thePath = `<h3>${this.workspacePath(this.uri)}</h3>`;
						break;
				}
			let options = {
				startLine: this.startLine,
				lineNumbers: this.printLineNumbers,
				uri: this.uri
			};
			return templateDocument
				.replace("VSCODE_PRINT_BASE_URL", this.baseUrl)
				.replace(/VSCODE_PRINT_DOCUMENT_TITLE/g, documentRenderer.getTitle(this.uri))
				.replace(/VSCODE_PRINT_DOCUMENT_HEADING/g, thePath)
				.replace("VSCODE_PRINT_PRINT_AND_CLOSE", printConfig.printAndClose)
				.replace("VSCODE_PRINT_CONTENT", () => documentRenderer.getBodyHtml(this.code, this.language, options))
				.replace("VSCODE_PRINT_STYLESHEET_LINKS", documentRenderer.getCssLinks(this.uri))
				.replace("VSCODE_PRINT_SCRIPT_TAGS", documentRenderer.getScriptTags(this.uri))
				;
		}
	}
	async docsInMultiselection() {
		const printConfig = vscode.workspace.getConfiguration("print");
		// findFile can't cope with nested brace lists in globs but we can flatten them using the braces package
		let excludePatterns: string[] = printConfig.folder.exclude || [];
		if (excludePatterns.length == 0) {
			excludePatterns.push("**/{data,node_modules,out,bin,obj,.*},**/*.{bin,dll,exe,hex,pdb,pdf,pfx,jpg,jpeg,gif,png,bmp,design}");
		}
		// one item should not be surrounded with braces, they would be treated as literals
		// but flatten them anyway in case the single pattern contains nested braces
		let excludeString: string;
		excludePatterns = this.flatten(excludePatterns); //prevent nested alternations
		excludeString = excludePatterns.length == 1 ? excludePatterns[0] : `{${excludePatterns.join(",")}}`;
		const fileUris = this.multiselection.filter(uri => !micromatch.isMatch(uri.path, excludeString));
		const docOpenSettlements = await Promise.allSettled(fileUris.map(uri => vscode.workspace.openTextDocument(uri)));
		const docs = await docOpenSettlements
			.filter(dos => dos.status === "fulfilled")
			.map(dos => (dos as PromiseFulfilledResult<vscode.TextDocument>).value);
		return docs;
	}
	async docsInFolder(): Promise<vscode.TextDocument[]> {
		logger.debug(`Enumerating the files in ${this.filepath}`);
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
		excludePatterns = this.flatten(excludePatterns); //prevent nested alternations
		excludes = excludePatterns.length == 1 ? excludePatterns[0] : `{${excludePatterns.join(",")}}`;
		let includes: string = includePatterns.length == 1 ? includePatterns[0] : `{${includePatterns.join(",")}}`;
		includePatterns = braces.expand(includes);
		includes = includePatterns.length == 1 ? includePatterns[0] : `{${includePatterns.join(",")}}`;

		let rel = new vscode.RelativePattern(this.filepath, includes);
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
	private flatten(patterns: Array<string>): Array<string> {
		const result = new Array<string>();
		for (const p of patterns) {
			if (p.includes("{")) {
				let subexpressions = braces.expand(p);
				subexpressions = this.flatten(subexpressions);
				result.splice(0, 0, ...subexpressions);
			}
			else {
				result.push(p)
			}
		}
		return result;
	}
	workspacePath(uri: vscode.Uri) {
		const wf = vscode.workspace.getWorkspaceFolder(uri);
		let result: string;
		if (wf) {
			result = path.relative(wf!.uri.fsPath, uri.fsPath)
		} else {
			result = tildify(uri.fsPath);
		}
		return result;
	}
}

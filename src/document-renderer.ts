import * as path from "path";
import * as vscode from "vscode";
import * as htmlRendererSourcecode from "./html-renderer-sourcecode";

export interface IDocumentRenderer {
	isEnabled?: () => boolean;
	getBodyHtml: (raw: string, languageId: string) => string,
	getTitle?: (filepath: string) => string,
	getCssUriStrings?: () => Array<string>,
	getResource?: (uri: vscode.Uri) => Buffer | string
}

export class DocumentRenderer {

	options: IDocumentRenderer;

	constructor(options: IDocumentRenderer) {
		this.options = options;
	}

	public getBodyHtml(raw: string, languageId: string) {
		return this.options.getBodyHtml(raw, languageId);
	}

	public getTitle(filename: string) {
		if (this.options.getTitle) {
			return this.options.getTitle(filename);
		} else {
			const parts = filename.split(path.sep);
			if (parts.length > 3) {
				filename = [parts[0], "...", parts[parts.length - 2], parts[parts.length - 1]].join(path.sep);
			}
			return filename;
		}
	}

	public isEnabled() {
		return this.options.isEnabled ? this.options.isEnabled() : true;
	}

	static __documentRenderers = new Map<string, DocumentRenderer>();

	static __defaultDocumentOptions: IDocumentRenderer = {
		getBodyHtml: htmlRendererSourcecode.getBodyHtml,
		getCssUriStrings: htmlRendererSourcecode.getCssUriStrings,
	};

	static __defaultDocumentRenderer = new DocumentRenderer(DocumentRenderer.__defaultDocumentOptions);

	public static register(langIds: string | string[], options: IDocumentRenderer) {
		const documentRenderer = new DocumentRenderer(options);
		langIds = typeof langIds === "string" ? [langIds] : langIds;
		langIds.forEach(langId =>
			DocumentRenderer.__documentRenderers.set(langId, documentRenderer)
		);
	}

	public static get(langId: string) {
		const documentRenderer = DocumentRenderer.__documentRenderers.get(langId)
			?? DocumentRenderer.__defaultDocumentRenderer;
		return documentRenderer.isEnabled() ? documentRenderer
			: DocumentRenderer.__defaultDocumentRenderer;
	}

	public getCssLinks(): string {
		return this.options.getCssUriStrings ? this.options.getCssUriStrings()
			.map(uriString => `\t<link href="${uriString}" rel="stylesheet" />`)
			.join("\n") : "";
	}

	public getResource(uri: vscode.Uri): Buffer | string {
		if (this.options.getResource) {
			return this.options.getResource(uri);
		} else {
			throw new Error(`Document renderer produced HTML that references "${uri.path}" but does not implement getResource`);
		}
	}

}
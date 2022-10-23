import { Uri } from 'vscode';
import * as hrSource from "./html-renderer-sourcecode";

export class DocumentRenderer {
	constructor(
		public getBodyHtml: (raw: string, languageId: string) => string,
		public getCssUriStrings: () => Array<string>,
		public getTitle: (filename: string) => string,
		public getResource?: (uri: Uri) => Buffer | string
	) { }

	static __documentRenderers = new Map<string, DocumentRenderer>();

	static __defaultDocumentRenderer = new DocumentRenderer(
		hrSource.getBodyHtml,
		hrSource.getCssUriStringArray,
		hrSource.getTitle,
		hrSource.getResource
	);

	public static register(
		langIds: string | string[],
		getBodyHtml: (raw: string, languageId: string) => string,
		getCssUriStrings: () => Array<string>,
		getTitle: (filename: string) => string,
		getResource?: (uri: Uri) => Buffer | string) {
		const documentRenderer = new DocumentRenderer(getBodyHtml, getCssUriStrings, getTitle, getResource);
		langIds = typeof langIds === "string" ? [langIds] : langIds;
		langIds.forEach(langId =>
			DocumentRenderer.__documentRenderers.set(langId, documentRenderer)
		);
	}

	public static get(langId: string) {
		return DocumentRenderer.__documentRenderers.get(langId)
			?? DocumentRenderer.__defaultDocumentRenderer;
	}

	public getCssLinks(): string {
		return this.getCssUriStrings()
			.map(uriString => `\t<link href="${uriString}" rel="stylesheet" />`)
			.join("\n");
	}

}
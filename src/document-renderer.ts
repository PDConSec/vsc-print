import * as hrSource from "./html-renderer-sourcecode";

export class DocumentRenderer {
	constructor(
		public getBodyHtml: Function,
		public getCssUriStrings?: Function,
		public getTitle?: Function,
		public getResource?: Function
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
		getBodyHtml: Function,
		getCssUriStrings?: Function,
		getTitle?: Function,
		getResource?: Function) {
		const documentRenderer = new DocumentRenderer(getBodyHtml, getCssUriStrings, getTitle, getResource);
		langIds = typeof langIds === "string" ? [langIds] : langIds;
		langIds.forEach(langId =>
			DocumentRenderer.__documentRenderers.set(langId, documentRenderer)
		);
	}

	public static resolve(langId: string) {
		return DocumentRenderer.__documentRenderers.get(langId)
			?? DocumentRenderer.__defaultDocumentRenderer;
	}

}
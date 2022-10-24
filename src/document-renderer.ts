import * as path from "path";
import { Uri } from "vscode";
import * as hrSource from "./html-renderer-sourcecode";

export class DocumentRenderer {
	constructor(
		public getBodyHtml: (raw: string, languageId: string) => string,
		public getTitle?: (filename: string) => string,
		public getCssUriStrings?: () => Array<string>,
		public getResource?: (uri: Uri) => Buffer | string
	) {
		if (!getTitle) {
			getTitle = (filename: string) => {
				const parts = filename.split(path.sep);
				if (parts.length > 3) {
					filename = [parts[0], "...", parts[parts.length - 2], parts[parts.length - 1]].join(path.sep);
				}
				return filename;			
			}
		}
		if (!getCssUriStrings) {
			getCssUriStrings = () => [];
		}
	}

	static __documentRenderers = new Map<string, DocumentRenderer>();

	static __defaultDocumentRenderer = new DocumentRenderer(
		hrSource.getBodyHtml,
		undefined,
		hrSource.getCssUriStrings
	);

	public static register(
		langIds: string | string[],
		getBodyHtml: (raw: string, languageId: string) => string,
		getCssUriStrings: () => Array<string>,
		getTitle: (filename: string) => string,
		getResource?: (uri: Uri) => Buffer | string) {
		const documentRenderer = new DocumentRenderer(getBodyHtml, undefined, getCssUriStrings);
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
		return this.getCssUriStrings ? this.getCssUriStrings()
			.map(uriString => `\t<link href="${uriString}" rel="stylesheet" />`)
			.join("\n") : "";
	}

}
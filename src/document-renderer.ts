import { IResourceDescriptor } from './IResourceDescriptor';
import { logger } from './logger';
import * as path from "path";
import * as vscode from "vscode";
import * as htmlRendererSourcecode from "./html-renderer-sourcecode";
import { IDocumentRenderer } from './IDocumentRenderer';

export class DocumentRenderer {

	options: IDocumentRenderer;

	constructor(options: IDocumentRenderer) {
		this.options = options;
	}

	public getBodyHtml(raw: string, languageId: string, options?:any) {
		return this.options.getBodyHtml(raw, languageId, options);
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
		if (this.options.isEnabled) {
			return this.options.isEnabled();
		} else {
			logger.debug("HTML renderer does not implement isEnabled, defaulting to true");
			return true;
		}
	}

	static __documentRenderers = new Map<string, DocumentRenderer>();

	static __defaultDocumentOptions: IDocumentRenderer = {
		getBodyHtml: htmlRendererSourcecode.getBodyHtml,
		getCssUriStrings: htmlRendererSourcecode.getCssUriStrings,
		getResource: htmlRendererSourcecode.getResource
	};

	static __defaultDocumentRenderer = new DocumentRenderer(DocumentRenderer.__defaultDocumentOptions);

	public static register(langIds: string | string[], options: IDocumentRenderer) {
		const documentRenderer = new DocumentRenderer(options);
		langIds = typeof langIds === "string" ? [langIds] : langIds;
		langIds.forEach(langId => 
			DocumentRenderer.__documentRenderers.set(langId, documentRenderer)
		);
		logger.debug(`Registered a document renderer for the following languages: ${langIds.join(", ")}`);
		return logger;
	}

	public static get(langId: string) {
		const documentRenderer = DocumentRenderer.__documentRenderers.get(langId);
		if (!documentRenderer) {
			logger.debug(`No document renderer is registered for ${langId}, using default (source code renderer)`);
			return this.__defaultDocumentRenderer;
		} else {
			const isEnabled = documentRenderer.isEnabled();
			if (documentRenderer.isEnabled()) {
				logger.debug(`Using the document renderer for ${langId}`);
				return documentRenderer;
			} else {
				logger.debug(`Document renderer for ${langId} is disabled, using default (source code renderer)`);
				return this.__defaultDocumentRenderer;
			}
		}
	}

	public getCssLinks(): string {
		let result: string = "";
		if (this.options.getCssUriStrings) {
			const us = this.options.getCssUriStrings();
			result = us.map(uriString => `\t<link href="${uriString}" rel="stylesheet" />`).join("\n");
		}
		return result;
	}

	public getResource(name:string): IResourceDescriptor {
		if (this.options.getResource) {
			return this.options.getResource(name);
		} else {
			throw new Error(`Document renderer produced HTML that references "${name}" but does not implement getResource`);
		}
	}

}
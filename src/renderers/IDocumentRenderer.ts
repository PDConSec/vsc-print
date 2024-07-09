import { ResourceProxy } from './resource-proxy';
import * as vscode from "vscode";


export interface IDocumentRenderer {
	isEnabled?: () => boolean;
  getBodyHtml: (generatedResources: Map<string, ResourceProxy>, raw: string, languageId: string, options?: any) => Promise<string>;
	getTitle?: (uri: vscode.Uri) => string;
	getCssUriStrings?: (uri: vscode.Uri) => Array<string>;
	getScriptUriStrings?: (uri: vscode.Uri) => Array<string>;
	getResource?: (name: string, requestingUri: any) => ResourceProxy;
}

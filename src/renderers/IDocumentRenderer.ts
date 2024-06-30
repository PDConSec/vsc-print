import { IResourceDescriptor } from './IResourceDescriptor';
import * as vscode from "vscode";


export interface IDocumentRenderer {
	isEnabled?: () => boolean;
  getBodyHtml: (generatedResources: Map<string, IResourceDescriptor>, raw: string, languageId: string, options?: any) => Promise<string>;
	getTitle?: (uri: vscode.Uri) => string;
	getCssUriStrings?: (uri: vscode.Uri) => Array<string>;
	getScriptUriStrings?: (uri: vscode.Uri) => Array<string>;
	getResource?: (name: string, requestingUri: any) => IResourceDescriptor;
}

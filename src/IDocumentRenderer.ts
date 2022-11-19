import { IResourceDescriptor } from './IResourceDescriptor';


export interface IDocumentRenderer {
	isEnabled?: () => boolean;
	getBodyHtml: (raw: string, languageId: string, options?: any) => string;
	getTitle?: (filepath: string) => string;
	getCssUriStrings?: () => Array<string>;
	getResource?: (name: string) => IResourceDescriptor;
}

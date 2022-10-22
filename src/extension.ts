import { logger } from './logger';
import { PrintSession } from './print-session';
import * as vscode from 'vscode';
import * as http from "http";
import { AddressInfo } from 'net';
import * as path from "path";
import { captionByFilename, filenameByCaption, localise } from './imports';
import * as nls from 'vscode-nls';
import { HtmlDocumentBuilder } from './html-document-builder';
import { extensionPath } from './extension-path';
import { DocumentRenderer } from './document-renderer';
import * as hrSvg from "./html-renderer-svg";
import * as hrSource from "./html-renderer-sourcecode";

// #region necessary for vscode-nls-dev
const localize = nls.config({ messageFormat: nls.MessageFormat.file })();
// function localise(s: string): string { return localize(s, "x"); }
localize("NO_FILE", "x");
localize("UNSAVED_FILE", "x");
localize("EMPTY_SELECTION", "x");
localize("ERROR_PRINTING", "x");
localize("ACCESS_DENIED_CREATING_WEBSERVER", "x");
localize("UNEXPECTED_ERROR", "x");
localize("TOO_MANY_FILES", "x");
localize("FILE_LIST_DISABLED", "x");
// #endregion

let server: http.Server | undefined;
const testFlags = new Set<string>();
if (captionByFilename[vscode.workspace.getConfiguration("print").colourScheme]) {
	// legacy value, convert
	let cbf = captionByFilename[vscode.workspace.getConfiguration("print").colourScheme];
	vscode.workspace.getConfiguration("print").update("colourScheme", cbf);
}
const printSessions = new Map<string, PrintSession>();
let _gc: NodeJS.Timer;

function gc() {
	const allKvps = Array.from(printSessions);
	const completed = allKvps.filter(kvp => kvp[1].completed);
	for (const sessionId of completed.map(c => c[0])) {
		printSessions.delete(sessionId);
	}
}

export function activate(context: vscode.ExtensionContext) {
	logger.debug("Print activated");

	let ecmPrint = vscode.workspace.getConfiguration("print", null).editorContextMenuItemPosition,
		etmButton = vscode.workspace.getConfiguration("print", null).editorTitleMenuButton,
		disposable: vscode.Disposable;
	vscode.commands.executeCommand("setContext", "ecmPrint", ecmPrint);
	vscode.commands.executeCommand("setContext", "etmButton", etmButton);

	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(checkConfigurationChange));
	context.subscriptions.push(vscode.commands.registerCommand("vsc-print.print", printCommand));
	context.subscriptions.push(vscode.commands.registerCommand("vsc-print.test.flags", () => testFlags));
	context.subscriptions.push(vscode.commands.registerCommand("vsc-print.test.sessionCount", () => printSessions.size));
	context.subscriptions.push(vscode.commands.registerCommand("vsc-print.gc", gc));
	context.subscriptions.push(vscode.commands.registerCommand("vsc-print.help", () => openDoc("manual")));
	context.subscriptions.push(vscode.commands.registerCommand("vsc-print.openLog", () => openDoc("log")));
	context.subscriptions.push(vscode.commands.registerCommand("vsc-print.test.browserLaunchCommand", PrintSession.getLaunchBrowserCommand));
	context.subscriptions.push(vscode.commands.registerCommand("print.registerDocumentRenderer", registerDocumentRenderer));

	server = http.createServer(async (request, response) => {
		try {
			if (request.url) {
				const urlParts = request.url.split('/',);
				const printSession = printSessions.get(urlParts[1]);
				if (printSession) {
					await printSession.respond(urlParts, response);
				} else {
					logger.warn(`Dropping connection of ${request.url} does not correspond to a print session`);
					return request.socket.end();
				}
			}
		} catch (error) {
			logger.error(error);
			response.setHeader("Content-Type", "text/plain; charset=utf-8");
			response.end((error as any).stack);
		}
	});
	server.on("error", (err: any) => {
		if (err) {
			switch (err.code) {
				case "EACCES":
					logger.debug(`ACCESS_DENIED_CREATING_WEBSERVER ${err.code}`);
					vscode.window.showErrorMessage(localise("ACCESS_DENIED_CREATING_WEBSERVER"));
					break;
				default:
					logger.debug(`UNEXPECTED_ERROR ${err.code}`);
					vscode.window.showErrorMessage(`${localise("UNEXPECTED_ERROR")}: ${err.code}`);
			}
		}
	});
	server.on("listening", () => {
		const addr = server!.address() as AddressInfo;
		PrintSession.port = addr.port;
		logger.info(`Began listening on ${addr.address}:${addr.port}`);
	});
	let printConfig = vscode.workspace.getConfiguration("print", null);
	server.listen(0, "localhost");
	const markdownExtensionInstaller = {
		extendMarkdownIt(mdparam: any) {
			HtmlDocumentBuilder.MarkdownEngine = mdparam;
			return mdparam;
		}
	};
	_gc = setInterval(gc, 2000);
	return markdownExtensionInstaller;
}

const documentRenderers = new Map<string, DocumentRenderer>();
const defaultDocumentRenderer = new DocumentRenderer(
	hrSource.getBodyHtml,
	hrSource.getCssUriArray,
	hrSource.getTitle,
	hrSource.getResource
);

function registerDocumentRenderer(
	langIds: string | string[],
	getBodyHtml: Function,
	getCssUriArray?: Function,
	getTitle?: Function,
	getResource?: Function) {
	const documentRenderer = new DocumentRenderer(getBodyHtml, getCssUriArray, getTitle, getResource);
	if (typeof langIds === "string") {
		documentRenderers.set(langIds, documentRenderer);
	} else {
		langIds.forEach(langId => documentRenderers.set(langId, documentRenderer));
	}
}

registerDocumentRenderer("svg",
	hrSvg.getBodyHtml, hrSvg.getCssUriArray,
	hrSvg.getTitle, hrSvg.getResource);

function getDocumentRenderer(langId: string) {
	return documentRenderers.get(langId) ?? defaultDocumentRenderer;
}

function openDoc(doc: string) {
	switch (doc) {
		case "manual":
			// todo localise the command that opens the manual
			let pathToManual = path.join(extensionPath, "doc/manual.md");
			let uriManual: vscode.Uri = vscode.Uri.file(pathToManual);
			vscode.commands.executeCommand('markdown.showPreview', uriManual);
			break;

		case "log":
			let pathToLogFile = path.join(extensionPath, "vscode-print.log");
			let uriLogFile: vscode.Uri = vscode.Uri.file(pathToLogFile);
			vscode.workspace.openTextDocument(uriLogFile).then(vscode.window.showTextDocument);
			break;
	}
}

const checkConfigurationChange = (e: vscode.ConfigurationChangeEvent) => {
	if (e.affectsConfiguration('print.editorContextMenuItemPosition')) {
		const ecmip = vscode.workspace.getConfiguration("print")
			.editorContextMenuItemPosition as string;
		logger.info(`editorContextMenuItemPosition set to ${ecmip}`)
		vscode.commands.executeCommand("setContext", "ecmPrint", ecmip);
	}
	else if (e.affectsConfiguration('print.editorTitleMenuButton')) {
		const etmb = vscode.workspace.getConfiguration("print", null)
			.get<boolean>('editorTitleMenuButton');
		logger.info(`editorTitleMenuButton set to ${etmb}`);
		vscode.commands.executeCommand("setContext", "etmButton", etmb);
	}
};

function printCommand(cmdArgs: any): PrintSession {
	logger.debug("Print command was invoked");
	const printSession = new PrintSession(cmdArgs);
	printSessions.set(printSession.sessionId, printSession);
	return printSession;
}

export function deactivate() {
	server?.close();
	clearInterval(_gc);
	logger.info("Garbage collection stopped by deactivate")
}


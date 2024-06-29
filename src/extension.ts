import { Metadata } from './metadata';
import { logger } from './logger';
import { PrintSession } from './print-session';
import * as vscode from 'vscode';
import * as http from "http";
import { AddressInfo } from 'net';
import * as path from "path";
import { HtmlDocumentBuilder } from './renderers/html-document-builder';
import { DocumentRenderer } from './renderers/document-renderer';
import * as htmlRendererMarkdown from "./renderers/html-renderer-markdown";
import * as htmlRendererPlaintext from "./renderers/html-renderer-plaintext";
import { captionByFilename } from './imports';

let server: http.Server | undefined;
const testFlags = new Set<string>();
if (captionByFilename[vscode.workspace.getConfiguration("print").colourScheme]) {
  // legacy value, convert
  let cbf = captionByFilename[vscode.workspace.getConfiguration("print").colourScheme];
  vscode.workspace.getConfiguration("print").update("colourScheme", cbf);
}
const printSessions = new Map<string, PrintSession>();
let _gc: NodeJS.Timeout;

function gc() {
  const allKvps = Array.from(printSessions);
  const completed = allKvps.filter(kvp => kvp[1].completed);
  for (const sessionId of completed.map(c => c[0])) {
    printSessions.delete(sessionId);
  }
}

export async function activate(context: vscode.ExtensionContext) {
  Metadata.ExtensionContext = context;
  logger.debug("Print activated");

  let ecmPrint = vscode.workspace.getConfiguration("print").editorContextMenuItemPosition;
  let etmButton = vscode.workspace.getConfiguration("print").editorTitleMenuButton;
  let disposable: vscode.Disposable;
  vscode.commands.executeCommand("setContext", "ecmPrint", ecmPrint);
  vscode.commands.executeCommand("setContext", "etmButton", etmButton);

  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(checkConfigurationChange));
  context.subscriptions.push(vscode.commands.registerCommand("vsc-print.whatsnew", launchWhatsNew));
  context.subscriptions.push(vscode.commands.registerCommand("vsc-print.preview", previewCommand));
  context.subscriptions.push(vscode.commands.registerCommand("vsc-print.print", printCommand));
  // context.subscriptions.push(vscode.commands.registerCommand("vsc-print.test.flags", () => testFlags));
  context.subscriptions.push(vscode.commands.registerCommand("vsc-print.test.sessionCount", () => printSessions.size));
  context.subscriptions.push(vscode.commands.registerCommand("vsc-print.gc", gc));
  context.subscriptions.push(vscode.commands.registerCommand("vsc-print.help", () => openDoc("manual")));
  context.subscriptions.push(vscode.commands.registerCommand("vsc-print.openLog", () => openDoc("log")));
  context.subscriptions.push(vscode.commands.registerCommand("print.registerDocumentRenderer", DocumentRenderer.register));
  context.subscriptions.push(vscode.commands.registerCommand("vsc-print.dumpCommands", dumpCommands));
  context.subscriptions.push(vscode.commands.registerCommand("vsc-print.dumpProperties", dumpProperties));

  // Could call DocumentRenderer.register directly,
  // but this shows how a third party HTML renderer 
  // would do it.
  vscode.commands.executeCommand("print.registerDocumentRenderer", "markdown", {
    getBodyHtml: htmlRendererMarkdown.getBodyHtml,
    getCssUriStrings: htmlRendererMarkdown.getCssUriStrings,
    getScriptUriStrings: htmlRendererMarkdown.getScriptUriStrings,
    getResource: htmlRendererMarkdown.getResource,
    isEnabled: htmlRendererMarkdown.isEnabled
  });
  // and here it is as a direct call just so you can compare them
  DocumentRenderer.register("plaintext", {
    getBodyHtml: htmlRendererPlaintext.getBodyHtml,
    getCssUriStrings: htmlRendererPlaintext.getCssUriStrings
  });

  const requestListener: http.RequestListener = async (request, response) => {
    try {
      const urlParts = decodeURI(request.url!).split('/',);
      if (urlParts[1] === "whatsnew") {
        response.writeHead(302, { 'Location': 'https://pdconsec.net/vscode-print/whatsnew' });
        return response.end();
      } else {
        const printSession = printSessions.get(urlParts[1]);
        if (printSession) {
          return await printSession.respond(urlParts, response);
        } else {
          logger.warn(`Dropping connection of ${request.url} does not correspond to a print session`);
          return request.socket.end();
        }
      }
    } catch (error) {
      logger.error(error);
      response.setHeader("Content-Type", "text/plain; charset=utf-8");
      return response.end((error as any).stack);
    }
  };
  server = http.createServer(requestListener);
  server.on("error", (err: any) => {
    if (err) {
      switch (err.code) {
        case "EACCES":
          logger.debug(`An “Access Denied” error occurred while starting the embedded webserver: ${err.code}`);
          vscode.window.showErrorMessage(vscode.l10n.t("An “Access Denied” error occurred while starting the embedded webserver"));
          break;
        default:
          logger.debug(`An unexpected error occurred: ${err.code}`);
          vscode.window.showErrorMessage(`${vscode.l10n.t("An unexpected error occurred")}: ${err.code}`);
      }
    }
  });
  server.on("listening", () => {
    const addr = server!.address() as AddressInfo;
    PrintSession.port = addr.port;
    logger.info(`Began listening on ${addr.address}:${addr.port}`);
  });
  server.listen(0, "localhost");

  const currentVersion = context.extension.packageJSON.version as string;
  const lastVersion = context.globalState.get("version") as string ?? "0.0.0"
  if (lastVersion !== currentVersion) {
    logger.warn(`Updated to ${currentVersion}`);
    const lastVersionPart = lastVersion.split(".");
    const currVersionPart = currentVersion.split(".");
    if (lastVersionPart[0] !== currVersionPart[0]) {
      // major version change
      advertiseWalkthrough();
      if (lastVersionPart[1] !== currVersionPart[1]) {
        // minor version change
        //todo re-enable when website is ready
        // launchWhatsNew();
      } else {
        // it's a maintenance version change so don't pester the user
      }
    }
    context.globalState.update("version", currentVersion);
  }

  const markdownExtensionInstaller = {
    extendMarkdownIt(mdparam: any) {
      HtmlDocumentBuilder.MarkdownEngine = mdparam;
      return mdparam;
    }
  };
  _gc = setInterval(gc, 2000);
  return markdownExtensionInstaller;
}

function openDoc(doc: string) {
  switch (doc) {
    case "manual":
      // todo localise the command that opens the manual
      let pathToManual = path.join(Metadata.ExtensionPath, "doc/manual.md");
      let uriManual: vscode.Uri = vscode.Uri.file(pathToManual);
      vscode.commands.executeCommand('markdown.showPreview', uriManual);
      break;

    case "log":
      let pathToLogFile = path.join(Metadata.ExtensionPath, "..", "vscode-print.log");
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

function printCommand(cmdArgs: any, multiselection: Array<vscode.Uri>): PrintSession {
  logger.debug("Print command was invoked");
  if (multiselection?.length > 1) {
    cmdArgs = multiselection;
  }
  const printSession = new PrintSession(cmdArgs, false);
  printSessions.set(printSession.sessionId, printSession);
  return printSession;
}

function previewCommand(cmdArgs: any, multiselection: Array<vscode.Uri>) {
  logger.debug("Preview command was invoked");
  if (multiselection?.length > 1) {
    cmdArgs = multiselection;
  }
  const printSession = new PrintSession(cmdArgs, true);
  printSessions.set(printSession.sessionId, printSession);
  return printSession;
}

export function deactivate() {
  server?.close();
  clearInterval(_gc);
  logger.info("Garbage collection stopped by deactivate")
}

function launchWhatsNew() {
  const addr = server!.address() as AddressInfo;
  const redirectToWhatsNewWithoutUpsettingVscode = vscode.Uri.parse(`http://localhost:${addr.port}/whatsnew`);
  vscode.env.openExternal(redirectToWhatsNewWithoutUpsettingVscode);
}

function advertiseWalkthrough() {
  vscode.commands.executeCommand(
    "workbench.action.openWalkthrough",
    "pdconsec.vscode-print#how-to-print",
    true
  );
}

function dumpCommands(): any {
  vscode.window.showInputBox({ prompt: "Dump commands beginning with" }).then(prefix => {
    for (const extension of vscode.extensions.all) {
      let commands = extension.packageJSON.contributes?.commands;
      if (Array.isArray(commands)) {
        const matchingCommands = commands.filter(cmd => cmd.command.startsWith(prefix))
        for (const command of matchingCommands) {
          console.log(`${extension.id}: ${command.command}`);
        }
      }
    }
  });
}
function dumpProperties(): any {
  vscode.window.showInputBox({ prompt: "Dump properties beginning with" }).then(prefix => {
    let matchCount = 0;
    for (const extension of vscode.extensions.all) {
      let configuration = extension.packageJSON.contributes?.configuration;
      if (Array.isArray(configuration)) {
        for (const item of configuration) {
          if (item.properties) {
            const propNames = Object.keys(item.properties);
            const matchingPropNames = prefix === "" ? propNames : propNames.filter(n => n.startsWith(prefix!));
            matchCount += matchingPropNames.length;
            for (const propname of matchingPropNames)
              if (propname) {
                const property = item.properties[propname];
                console.log(`${extension.id}: ${propname}`);
              }
          }
        }
      }
    }
    console.log(`${matchCount} properties start with ${prefix}`);
  });
}

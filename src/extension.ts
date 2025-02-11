import { Metadata } from './metadata';
import { logger } from './logger';
import { PrintSession } from './print-session';
import * as vscode from 'vscode';
import * as http from "http";
import { AddressInfo } from 'net';
import * as path from "path";
import { DocumentRenderer } from './renderers/document-renderer';
import * as htmlRendererMarkdown from "./renderers/html-renderer-markdown";
import * as htmlRendererPlaintext from "./renderers/html-renderer-plaintext";
import { captionByFilename } from './imports';
import * as fs from "fs";
import { WebSocketServer } from "ws";
import WebSocket from 'ws';
import { marked, Parser, Renderer, Tokens } from 'marked';
import { at } from 'lodash';
import Browsers from './browser-paths';

const markedRenderer = new Renderer();
markedRenderer.parser = new Parser();

function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function base64Encode(text: string) {
  return Buffer.from(text, 'utf-8').toString('base64');
}

function base64Decode(text: string) {
  return Buffer.from(text, 'base64').toString('utf-8');
}

marked.use({
  renderer: {
    code(token: Tokens.Code) {
      const result = `<pre data-source-map="${base64Encode(token.raw)}"><code>${escapeHtml(token.text)}</code></pre>\n`;
      return result;
    },
    heading(token: Tokens.Heading) {
      const html = markedRenderer.heading(token);
      return html.replace(/^<h\d/, `$& data-source-map="${base64Encode(token.raw)}"`);
    },
    paragraph(token: Tokens.Paragraph) {
      const html = markedRenderer.paragraph(token);
      return html.replace(/^<p/, `$& data-source-map="${base64Encode(token.raw)}"`);
    },
    blockquote(token: Tokens.Blockquote) {
      const html = markedRenderer.blockquote(token);
      return html.replace(/^<blockquote/, `$& data-source-map="${base64Encode(token.raw)}"`);
    },
    listitem(token: Tokens.ListItem) {
      const html = markedRenderer.listitem(token);
      return html.replace(/^<li/, `$& data-source-map="${base64Encode(token.raw)}"`);
    },
    table(token: Tokens.Table) {
      const lineEnding = '\n';
      const headerRaw = token.raw.split(lineEnding)[0];
      const bodyRaw = token.raw.trim().split(lineEnding).slice(2).join(lineEnding);
      const rowsRaw = bodyRaw.split(lineEnding);
      const parts = markedRenderer.table(token).split("/thead");
      parts[0] = parts[0].replace(/<tr/, `$& data-source-map="${base64Encode(headerRaw)}"`);
      for (const rowRaw of rowsRaw) {
        parts[1] = parts[1].replace(/<tr>/, `<tr data-source-map="${base64Encode(rowRaw)}">`);
      }
      const html = parts.join("/thead");
      return html;
    }
  }
});

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
    const printSession = printSessions.get(sessionId);
    printSession!.dispose();
    printSessions.delete(sessionId);
  }
}

export async function activate(context: vscode.ExtensionContext) {
  Metadata.ExtensionContext = context;
  logger.debug("Print activated");

  let ecmPrint = vscode.workspace.getConfiguration("print").editorContextMenuItemPosition;
  let etmButtonPrint = vscode.workspace.getConfiguration("print").editorTitleMenuButtonPrint;
  let etmButtonPreview = vscode.workspace.getConfiguration("print").editorTitleMenuButtonPreview;
  let disposable: vscode.Disposable;
  vscode.commands.executeCommand("setContext", "ecmPrint", ecmPrint);
  vscode.commands.executeCommand("setContext", "etmButtonPrint", etmButtonPrint);
  vscode.commands.executeCommand("setContext", "etmButtonPreview", etmButtonPreview);

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
  context.subscriptions.push(vscode.commands.registerCommand("vsc-print.setAlternateBrowser", setAlternateBrowser));

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
      response.setHeader("Access-Control-Allow-Origin", '*');
      response.setHeader("Access-Control-Allow-Methods", 'GET');
      response.setHeader("Access-Control-Allow-Headers", 'Content-Type');
      const urlParts = decodeURI(request.url!).split('/',);
      if (urlParts[1] === "whatsnew") {
        response.writeHead(302, { 'Location': 'https://pdconsec.net/vscode-print/whatsnew' });
        return response.end();
      } else if (urlParts[1] === "favicon.ico") {
        const p = path.join(Metadata.ExtensionPath, "favicon.ico");
        const content = await fs.promises.readFile(p);
        response.writeHead(200, {
          "Content-Type": "image/vnd.microsoft.icon",
          "Content-Length": content.length
        });
        return response.end(content);
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

  // WebSocket server is attached to webserver and uses the same port
  const websocketServer = new WebSocketServer({ server });
  interface SessionData { sessionid: string;[key: string]: any; }
  websocketServer.on('connection', (ws) => {
    console.log('New client connected');
    ws.on('message', (message: string) => {
      const data: SessionData = JSON.parse(message);
      if (data.sessionId) {
        const printSession = printSessions.get(data.sessionId);
        printSession?.configureWebsocket(ws);
      }
      if (data.type === 'findInEditor') {
        const text = data.value;
        findAndHighlightText(text);
      }
    });
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  function findAndHighlightText(text: string) {
    text = base64Decode(text);
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      const fullText = document.getText();
      if (fullText.includes('\r\n')) {
        text = text.replace(/\n/g, '\r\n');
      }
      const startIndex = fullText.indexOf(text);
      if (startIndex !== -1) {
        const startPos = document.positionAt(startIndex);
        const endPos = document.positionAt(startIndex + text.length);
        const range = new vscode.Range(startPos, endPos);
        editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
        editor.selection = new vscode.Selection(startPos, endPos);
      }
    }
  }

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

  _gc = setInterval(gc, 2000);

}

function openDoc(doc: string) {
  switch (doc) {
    case "manual":
      // localise the version of the manual that is opened
      const localeMap: { [key: string]: string } = {
        "en": "eng",
        "zh-cn": "zho",
        "ja": "jpn",
        "es": "spa",
        "ru": "rus",
        "pt": "por",
        "fr": "fra",
        "ko": "kor",
        "zh-hant": "zho",
        "it": "ita",
        "pl": "pol",
        "hu": "hun",
        "cs": "ces",
        "bg": "bul",
        "tr": "tur",
        "my": "mya",
        "ca": "cat",
        "lt": "lit",
        "hy": "hye"
      };
      let locale = localeMap[vscode.env.language] || "eng";
      let pathToManual = path.join(Metadata.ExtensionPath, `../doc/manual.${locale}.md`);
      if (!fs.existsSync(pathToManual)) {
        locale = "eng";
        pathToManual = path.join(Metadata.ExtensionPath, `../doc/manual.${locale}.md`);
      }
      if (!fs.existsSync(pathToManual)) {
        pathToManual = path.join(Metadata.ExtensionPath, "../doc/manual.md");
      }
      let uriManual: vscode.Uri = vscode.Uri.file(pathToManual);
      // preview the uri as though the preview command had been invoked
      previewCommand(uriManual, []);
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
  else if (e.affectsConfiguration('print.editorTitleMenuButtonPrint')) {
    const etmb = vscode.workspace.getConfiguration("print", null)
      .get<boolean>('editorTitleMenuButtonPrint');
    logger.info(`editorTitleMenuButtonPrint set to ${etmb}`);
    vscode.commands.executeCommand("setContext", "etmButtonPrint", etmb);
  }
  else if (e.affectsConfiguration('print.editorTitleMenuButtonPreview')) {
    const etmb = vscode.workspace.getConfiguration("print", null)
      .get<boolean>('editorTitleMenuButtonPreview');
    logger.info(`editorTitleMenuButtonPreview set to ${etmb}`);
    vscode.commands.executeCommand("setContext", "etmButtonPreview", etmb);
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

async function setAlternateBrowser() {
  const browser = await Browsers.promptUserChoice();
  if (browser) {
    await vscode.workspace.getConfiguration("print").update("browserPath", browser.path, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(`Alternate browser set to ${browser.name}`);
  }
}

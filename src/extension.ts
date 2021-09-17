import * as vscode from 'vscode';
import * as hljs from "highlight.js";
import * as http from "http";
import * as dns from "dns";
import * as child_process from "child_process";
import { AddressInfo } from 'net';
import * as path from "path";
import * as braces from "braces";
import { captionByFilename, filenameByCaption, defaultCss, localise } from './imports';
import * as nls from 'vscode-nls';

// #region necessary for vscode-nls-dev
const localize = nls.config({ messageFormat: nls.MessageFormat.file })();
// function localise(s: string): string { return localize(s, "x"); }
localize("NO_FILE", "x");
localize("UNSAVED_FILE", "x");
localize("EMPTY_SELECTION", "x");
localize("ERROR_PRINTING", "x");
localize("ACCESS_DENIED_CREATING_WEBSERVER", "x");
localize("UNEXPECTED_ERROR", "x");
// #endregion

let colourScheme = vscode.workspace.getConfiguration("print", null).colourScheme;
if (captionByFilename[colourScheme]) {
  // legacy value, convert
  vscode.workspace.getConfiguration("print", null).update("colourScheme", captionByFilename[colourScheme]);
} else {
  colourScheme = filenameByCaption[colourScheme];
  if (!colourScheme) {
    colourScheme = "atelier-dune-light";
    vscode.workspace.getConfiguration("print", null).update("colourScheme", captionByFilename[colourScheme]);
  }
}
let swatchCss: string = require(`highlight.js/styles/${colourScheme}.css`).default.toString();
var md: any;
var selection: vscode.Selection | undefined;
const browserLaunchMap: any = { darwin: "open", linux: "xdg-open", win32: "start" };
export function activate(context: vscode.ExtensionContext) {
  let ecmPrint = vscode.workspace.getConfiguration("print", null).editorContextMenuItemPosition,
    etmButton = vscode.workspace.getConfiguration("print", null).editorTitleMenuButton,
    disposable: vscode.Disposable;
  vscode.commands.executeCommand("setContext", "ecmPrint", ecmPrint);
  vscode.commands.executeCommand("setContext", "etmButton", etmButton);

  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(checkConfigurationChange));
  context.subscriptions.push(vscode.commands.registerCommand("extension.print", printCommand));
  context.subscriptions.push(vscode.commands.registerCommand("extension.printFolder", printFolderCommand));

  // capture the extension path
  disposable = vscode.commands.registerCommand('extension.help', async (cmdArgs: any) => {
    let pathToManual = path.join(context.extensionPath, "manual.md");
    let uriManual: vscode.Uri = vscode.Uri.file(pathToManual);
    vscode.commands.executeCommand('markdown.showPreview', uriManual);
  });
  context.subscriptions.push(disposable);
  const markdownExtensionInstaller = {
    extendMarkdownIt(mdparam: any) {
      return md = mdparam;
    }
  };
  return markdownExtensionInstaller;
}

const checkConfigurationChange = (e: vscode.ConfigurationChangeEvent) => {
  if (e.affectsConfiguration('print.editorContextMenuItemPosition')) {
    vscode.commands.executeCommand(
      "setContext", "ecmPrint",
      vscode.workspace.getConfiguration("print", null)
        .get('editorContextMenuItemPosition'));
  }
  else if (e.affectsConfiguration('print.editorTitleMenuButton')) {
    vscode.commands.executeCommand(
      "setContext", "etmButton",
      vscode.workspace.getConfiguration("print", null)
        .get<boolean>('editorTitleMenuButton'));
  }
  else if (e.affectsConfiguration('print.colourScheme')) {
    colourScheme = filenameByCaption[vscode.workspace.getConfiguration("print", null).colourScheme];
    swatchCss = require(`highlight.js/styles/${colourScheme}.css`).default.toString();
  }
};

async function printCommand(cmdArgs: any) {

  let editor = vscode.window.activeTextEditor;
  selection = editor && editor.selection ? editor.selection : undefined;

  let uri: vscode.Uri;
  if (cmdArgs) {
    uri = cmdArgs as vscode.Uri;
  }
  else if (vscode.window.activeTextEditor) {
    uri = vscode.window.activeTextEditor.document.uri;
  }
  else {
    vscode.window.showErrorMessage(localise("NO_FILE"));
    return;
  }

  await print(uri);
}

async function printFolderCommand(commandArgs: any) {
  const editor = vscode.window.activeTextEditor;
  let directory: string;
  if (commandArgs) {
    directory = commandArgs.fsPath;
  }
  else if (editor) {
    if (editor.document.isUntitled) {
      vscode.window.showErrorMessage(localise("UNSAVED_FILE"));
      return;
    }
    directory = path.dirname(editor.document.uri.fsPath);
  }
  else {
    vscode.window.showErrorMessage(localise("NO_SELECTION"));
    return;
  }

  await print(vscode.Uri.file(directory));
}

async function print(fileUri: vscode.Uri) {
  await startWebserver(() => getHtml(fileUri));

  let printConfig = vscode.workspace.getConfiguration("print", null);
  let q = process.platform === "win32" ? '"' : "";
  let cmd = printConfig.alternateBrowser && printConfig.browserPath ? `${q}${printConfig.browserPath}${q}` : browserLaunchMap[process.platform];
  child_process.exec(`${cmd} http://localhost:${port}/`, (error: child_process.ExecException | null, stdout: string, stderr: string) => {
    // node on Linux incorrectly calls this error handler, with a null error object
    if (error) {
      vscode.window.showErrorMessage(`${localise("ERROR_PRINTING")}: ${error ? error.message : stderr}`);
    }
  });
}

class SourceCode {
  public filename: string;
  public code: string;
  public language: string;

  constructor(filename: string, code: string, language: string) {
    this.filename = filename;
    this.code = code;
    this.language = language;
  }
}

async function getSourceCode(uri: vscode.Uri, fileMatcher: ((document: vscode.TextDocument) => boolean) = (x) => true): Promise<SourceCode | null> {
  const editor = vscode.window.activeTextEditor;
  // if uri is for the active editor
  if (editor && uri === editor.document.uri) {
    let code;
    // if there's a non-empty selection defined get code from the selection
    if (selection && !selection.isEmpty) {
      code = editor.document.getText(new vscode.Range(selection.start, selection.end)).replace(/\s*$/, "");
    }
    else {
      code = editor.document.getText();
    }
    return new SourceCode(uri.fsPath, code.trimRight(), editor.document.languageId);
  } else {
    // load it to get the text and the langId
    let otd = await vscode.workspace.openTextDocument(uri);
    return fileMatcher(otd) ? new SourceCode(uri.fsPath, otd.getText().trimRight(), otd.languageId) : null;
  }
}

/* 
properly open/close syntax highlighting spans across line breaks
necessary for e.g. multiline comments, otherwise the span is broken across tr/td
maintains a stack of classes, and pushes/pops them upon seeing <span> and </span> tags
for each line, adds in the appropriate <span>s at the beginning and </span>s at the end
*/
function fixMultilineSpans(text: string) {
  let classes: string[] = [];

  // since this code runs on simple, well-behaved, escaped HTML, we can just
  // use regex matching for the span tags and classes

  // first capture group is if it's a closing tag, second is tag attributes
  const spanRegex = /<(\/?)span(.*?)>/g;
  // https://stackoverflow.com/questions/317053/regular-expression-for-extracting-tag-attributes
  // matches single html attribute, first capture group is attr name and second is value
  const tagAttrRegex = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/g;

  return text.split("\n").map(line => {
    const pre = classes.map(classVal => `<span class="${classVal}">`);

    let spanMatch;
    spanRegex.lastIndex = 0; // exec maintains state which we need to reset
    while ((spanMatch = spanRegex.exec(line)) !== null) {
      if (spanMatch[1] !== "") {
        classes.pop();
        continue;
      }
      let attrMatch;
      tagAttrRegex.lastIndex = 0;
      while ((attrMatch = tagAttrRegex.exec(spanMatch[2])) !== null) {
        if (attrMatch[1].toLowerCase().trim() === "class") {
          classes.push(attrMatch[2]);
        }
      }
    }

    return pre + line + "</span>".repeat(classes.length);
  }).join("\n");
}

const lineNumberCss = `
/* Line numbers */

table {
  border: none;
  border-collapse: collapse;
}
.line-number {
  border-right: thin solid silver;
  padding-right: 0.3em;
  text-align: right;
  vertical-align: top;
}
.line-text {
  margin-left: 0.7em;
  padding-bottom: {lineSpacing}em;
  white-space: pre-wrap;
}
`;

function Utf8ArrayToStr(array: Uint8Array) {
  var out, i, len, c;
  var char2, char3;
  out = "";
  len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) |
          ((char2 & 0x3F) << 6) |
          ((char3 & 0x3F) << 0));
        break;
    }
  }
  return out;
}

async function getHtml(uri: vscode.Uri): Promise<string> {
  const printConfig = vscode.workspace.getConfiguration("print", null);
  const printFilenames = printConfig.folder.fileNames;
  let printAndClose = printConfig.printAndClose ? " onload = \"window.print();\" onafterprint=\"window.close();\"" : "";

  if (printConfig.renderMarkdown && uri.fsPath.toLowerCase().split('.').pop() === "md") {
    let markdownConfig = vscode.workspace.getConfiguration("markdown", null);
    let raw = Utf8ArrayToStr(await vscode.workspace.fs.readFile(uri));
    let content: String = md.render(raw);
    try {
      // 1 - prepend base local path to relative URLs
      let basePath = uri.fsPath.replace(/\\/g, "/") // forward slashes only, they work on all platforms
        .replace(/\/[^\/]*$/, ""); // clip file name
      content = content.replace(/(img src=")(?!http[s]?)(?![a-z]:)(?!\/)([^"]+)/gi, `$1${basePath}/$2`);
      // 2 - encode colons, spaces, and other special chars in file path parts
      content = content.replace(/(img src=")(?!http[s]?)([^"]+)/gi, ($0, $1, $2: string) =>
        $1 + $2.split("/").map(encodeURIComponent).join("/"));
    } catch (error) {
    }
    let result = `<!DOCTYPE html><html><head><title>${uri.fsPath}</title>
    <meta charset="utf-8"/>
    <style>
    html, body { ${printConfig.markdownRenderingBodyStyle} }
    p { ${printConfig.markdownRenderingParagraphStyle} }
    h1,h2,h3,h4,h5,h6 { ${printConfig.markdownRenderingHeadingStyle} }
    table { ${printConfig.markdownRenderingTableStyle} }
    th { ${printConfig.markdownRenderingTableHeadingStyle} }
    td { ${printConfig.markdownRenderingTableDataStyle} }
    ol,ul { ${printConfig.markdownRenderingListStyle} }
    img {
      max-width: 100%;
    }
    h1,h2,h3,h4,h5,h6 {
      page-break-after:avoid;
      page-break-inside:avoid;
    }
    </style>
    ${markdownConfig.styles.map((cssFilename: string) => `<link href="${cssFilename}" rel="stylesheet" />`).join("\n")}
    </head>
		<body${printAndClose}>${content}</body></html>`;
    return result;
  }

  // Fetch source code for directory or single file
  let codePromises: Promise<SourceCode | null>[];
  let uristat = await vscode.workspace.fs.stat(uri);
  if (uristat.type === vscode.FileType.Directory) {

    // findFile can't cope with nested brace lists in globs but we can flatten them using the braces package
    let excludePatterns: string[] = printConfig.folder.exclude || [];
    if (excludePatterns.length == 0) {
      excludePatterns.push("**/{data,node_modules,out,bin,obj,.*},**/*.{bin,dll,exe,hex,pdb,pdf,pfx,jpg,jpeg,gif,png,bmp}");
    }
    let includePatterns: string[] = printConfig.folder.include || [];
    if (includePatterns.length == 0) {
      includePatterns.push("**/*");
    }
    // one item should not be surrounded with braces, they would be treated as literals
    // but flatten them anyway in case the single pattern contains nested braces
    let excludes: string = excludePatterns.length == 1 ? excludePatterns[0] : `{${excludePatterns.join(",")}}`;
    excludePatterns = braces.expand(excludes); //no braces in patterns
    excludes = excludePatterns.length == 1 ? excludePatterns[0] : `{${excludePatterns.join(",")}}`;
    let includes: string = includePatterns.length == 1 ? includePatterns[0] : `{${includePatterns.join(",")}}`;
    includePatterns = braces.expand(includes);
    includes = includePatterns.length == 1 ? includePatterns[0] : `{${includePatterns.join(",")}}`;

    let rel = new vscode.RelativePattern(uri.fsPath, includes);
    const maxLineCount = printConfig.folder.maxLines;
    const matcher = (document: vscode.TextDocument): boolean => document.lineCount < maxLineCount;
    const ff = await vscode.workspace.findFiles(rel, excludes);
    codePromises = ff.map(x => getSourceCode(x, matcher));
  } else {
    codePromises = [getSourceCode(uri)];
  }
  //  Wait for all code to load
  let allCode = (await Promise.all(codePromises)).filter(x => x !== null) as SourceCode[];
  // Sort files by path depth and name
  allCode = allCode.sort((a, b) => {
    const matchesA = a.filename.match(/(?:\/|\\).+?/g);
    const matchesB = b.filename.match(/(?:\/|\\).+?/g);
    const depthA = matchesA ? matchesA.length : 0;
    const depthB = matchesB ? matchesB.length : 0;

    if (depthA > depthB) {
      return 1;
    }
    else if (depthB > depthA) {
      return -1;
    }

    return a.filename.localeCompare(b.filename);
  });

  let body = "";
  for (const sourceCode of allCode) {
    let renderedCode = "";
    try {
      renderedCode = hljs.highlight(sourceCode.language, sourceCode.code).value;
    }
    catch (err) {
      renderedCode = hljs.highlightAuto(sourceCode.code).value;
    }

    renderedCode = fixMultilineSpans(renderedCode);

    var addLineNumbers = printConfig.lineNumbers === "on" || (printConfig.lineNumbers === "inherit" && vscode.window.activeTextEditor && (vscode.window.activeTextEditor.options.lineNumbers || 0) > 0);
    if (addLineNumbers) {
      var startLine = selection && !(selection.isEmpty || selection.isSingleLine) ? selection.start.line + 1 : 1;
      renderedCode = renderedCode
        .split("\n")
        .map(line => line || "&nbsp;")
        .map((line, i) => `<tr><td class="line-number">${startLine + i}</td><td class="line-text">${line}</td></tr>`)
        .join("\n")
        .replace("\n</td>", "</td>")
        ;
    } else {
      renderedCode = renderedCode
        .split("\n")
        .map(line => line || "&nbsp;")
        .map((line, i) => `<tr><td class="line-text">${line}</td></tr>`)
        .join("\n")
        .replace("\n</td>", "</td>")
        ;
    }

    body += '<div class="file">';
    if (printFilenames && allCode.length > 1) {
      body += `<h3>${sourceCode.filename}</h3>`;
    }
    body += `<table class="hljs">${renderedCode}</table></div>`;
  }


  let editorConfig = vscode.workspace.getConfiguration("editor", null);
  let html = `<html><head><title>${uri.fsPath}</title><meta charset="utf-8"/>
  <style>
    ${defaultCss}
    ${swatchCss}
    table.hljs {background:none;}
    html,body{color:white}
    body{
      margin:0;padding:0;tab-size:${editorConfig.tabSize}
    }
    ${lineNumberCss.replace("{lineSpacing}", (printConfig.lineSpacing - 1).toString())}
    h3 {
      font-family: Consolas;
      margin-bottom: 0px;
    }
    .file {
      break-inside: avoid;
    }
    .hljs {
      max-width:100%; width:100%; font-family: "${editorConfig.fontFamily}", monospace; font-size: ${printConfig.fontSize};
    }
  </style></head>
  <body${printAndClose}>
    ${body}
  </body></html>`;
  return html;
}

var server: http.Server | undefined;
var port: number;
let serverTimeout: NodeJS.Timeout | undefined;

function startWebserver(generateSource: () => Promise<string>): Promise<void> {
  stopWebServer();
  return new Promise(async (resolve, reject) => {
    // prepare to service an http request
    server = http.createServer(async (request, response) => {
      if (!connectingToLocalhost(request)) {
        return request.socket.end();
      }
      try {
        if (request.url) {
          if (request.url === "/") {
            response.setHeader("Content-Type", "text/html");
            let html = await generateSource();
            response.end(html);
          } else {
            let filePath: string = decodeURIComponent(request.url).replace(/^\/([a-z]:)/, "$1"); // Remove leading / on Windows paths
            // if (fs.existsSync(filePath)) {
            //   let cb = fs.statSync(filePath).size;
            //   let lastdotpos = request.url.lastIndexOf('.');
            //   let fileExt = request.url.substr(lastdotpos + 1);
            //   response.setHeader("Content-Type", `image/${fileExt}`);
            //   response.setHeader("Content-Length", cb);
            //   fs.createReadStream(filePath).pipe(response);
            // } else {
            //   // 404
            //   response.writeHead(404, { "Content-Type": "text/html" })
            //   response.end("FILE NOT FOUND")
            // }
          }
        }
      } catch (error) {
        response.setHeader("Content-Type", "text/plain");
        response.end(error.stack);
      }
    });
    // report exceptions
    server.on("error", (err: any) => {
      if (err) {
        switch (err.code) {
          case "EACCES":
            vscode.window.showErrorMessage(localise("ACCESS_DENIED_CREATING_WEBSERVER"));
            break;
          default:
            vscode.window.showErrorMessage(`${localise("UNEXPECTED_ERROR")}: ${err.code}`);
        }
      }
    });
    server.on("listening", () => {
      port = (server!.address() as AddressInfo).port;
      resolve();
    });
    let printConfig = vscode.workspace.getConfiguration("print", null);
    server.listen();
    const webserverUptimeSecs = printConfig.get<number>("webserverUptimeSeconds", 0);
    if (webserverUptimeSecs) {
      serverTimeout = setTimeout(() => {
        stopWebServer();
      }, webserverUptimeSecs * 1000);
    }
  });
}

function stopWebServer() {
  if (serverTimeout) {
    clearTimeout(serverTimeout);
    serverTimeout = undefined;
  }
  if (server) {
    server.close();
    server = undefined;
    port = 0;
  }
}

export function deactivate() {
  stopWebServer();
}

const localhostAddresses: String[] = ["::1", "::ffff:127.0.0.1", "127.0.0.1"]
dns.lookup("localhost", { all: true, family: 4 }, (err, addresses) => {
  addresses
    .map(a => a.address)
    .filter(a => localhostAddresses.indexOf(a) < 0)
    .forEach(a => { localhostAddresses.push(a); localhostAddresses.push("::ffff:" + a); });
})
dns.lookup("localhost", { all: true, family: 6 }, (err, addresses) => {
  addresses
    .map(a => a.address)
    .filter(a => localhostAddresses.indexOf(a) < 0)
    .forEach(a => localhostAddresses.push(a));
})

function connectingToLocalhost(request: http.IncomingMessage): boolean {
  console.log(request.socket.localAddress)
  return localhostAddresses.indexOf(request.socket.localAddress) >= 0;
}

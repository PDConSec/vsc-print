import * as vscode from 'vscode';
import * as hljs from "highlight.js";
import * as http from "http";
import * as child_process from "child_process";
import * as fs from "fs";
import { AddressInfo } from 'net';
import * as path from "path";
import * as globby from "globby";

var md: any;
var selection: vscode.Selection | undefined;
const browserLaunchMap: any = { darwin: "open", linux: "xdg-open", win32: "start" };
export function activate(context: vscode.ExtensionContext) {
  let ecmPrint = vscode.workspace.getConfiguration("print", null).editorContextMenuItemPosition,
    etmButton = vscode.workspace.getConfiguration("print", null).editorTitleMenuButton;
  vscode.commands.executeCommand("setContext", "ecmPrint", ecmPrint);
  vscode.commands.executeCommand("setContext", "etmButton", etmButton);

  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(checkConfigurationChange));
  context.subscriptions.push(vscode.commands.registerCommand("extension.print", printCommand));
  context.subscriptions.push(vscode.commands.registerCommand("extension.printFolder", printFolderCommand));
  let disposable = vscode.commands.registerCommand('extension.browse', async (cmdArgs: any) => {
    let x = vscode.extensions.getExtension("pdconsec.vscode-print");
    if (!x) { throw new Error("Cannot resolve extension. Has the name changed? It is defined by the publisher and the extension name defined in package.json"); }
    var styleCachePath = `${x.extensionPath.replace(/\\/g, "/")}/node_modules/highlight.js/styles`;
    let printConfig = vscode.workspace.getConfiguration("print", null);
    let currentPath = `${styleCachePath}/${printConfig.colourScheme}.css`;
    vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectMany: false,
      defaultUri: vscode.Uri.file(fs.existsSync(currentPath) ? currentPath : styleCachePath),
      filters: {
        Stylesheet: ['css']
      }
    }).then(f => {
      if (f) {
        let p = f[0].fsPath.replace(/\\/g, "/");
        let lastSlashPosition = p.lastIndexOf("/");
        let extensionSeparatorPosition = p.lastIndexOf(".");
        if (extensionSeparatorPosition === -1) {
          extensionSeparatorPosition = p.length;
        }
        var path = p.substring(0, lastSlashPosition);
        var fileName = p.substring(lastSlashPosition + 1, extensionSeparatorPosition);
        try {
          vscode.workspace.getConfiguration().update("print.colourScheme", fileName, vscode.ConfigurationTarget.Global).then(() => {
            if (path !== styleCachePath) {
              let newCachePath = `${styleCachePath}/${fileName}`;
              fs.copyFile(p, newCachePath, err => {
                if (err) {
                  vscode.window.showErrorMessage(err.message);
                }
              });
            }
          }, (err) => {
            debugger;
          });
        } catch (err) {
          debugger;
        }
      }
    });
  });
  context.subscriptions.push(disposable);

  // capture the extension path
  disposable = vscode.commands.registerCommand('extension.help', async (cmdArgs: any) => {
    let pathToManual = path.join(context.extensionPath, "manual.md");
    let uriManual: vscode.Uri = vscode.Uri.file(pathToManual);
    vscode.commands.executeCommand('markdown.showPreview', uriManual);
  });
  context.subscriptions.push(disposable);
  return { extendMarkdownIt(mdparam: any) { return md = mdparam; } };
}

const checkConfigurationChange = (e: vscode.ConfigurationChangeEvent) => {
  if (e.affectsConfiguration('print.editorContextMenuItemPosition')) {
    vscode.commands.executeCommand(
      "setContext", "ecmPrint",
      vscode.workspace.getConfiguration("print", null)
        .get('editorContextMenuItemPosition'));
  }
  if (e.affectsConfiguration('print.editorTitleMenuButton')) {
    vscode.commands.executeCommand(
      "setContext", "etmButton",
      vscode.workspace.getConfiguration("print", null)
        .get<boolean>('editorTitleMenuButton'));
  }
};

async function printCommand(cmdArgs: any) {
  let editor = vscode.window.activeTextEditor;
  selection = editor && editor.selection ? editor.selection : undefined;

  let fsPath: string;
  if (cmdArgs) {
    fsPath = cmdArgs.fsPath;
  }
  else if (vscode.window.activeTextEditor) {
    fsPath = vscode.window.activeTextEditor.document.uri.fsPath;
  }
  else {
    vscode.window.showErrorMessage("No file opened. Open a file in the editor and try again.");
    return;
  }

  await print(fsPath);
}

async function printFolderCommand(commandArgs: any) {
  const editor = vscode.window.activeTextEditor;
  let directory: string;
  if (commandArgs) {
    directory = commandArgs.fsPath;
  }
  else if (editor) {
    directory = path.dirname(editor.document.uri.fsPath);
  }
  else {
    vscode.window.showErrorMessage("No file opened. Open a file in the editor and try again.");
    return;
  }

  await print(directory);
}

async function print(filePath: string) {
  await startWebserver(() => getRenderedSourceCode(filePath));

  let printConfig = vscode.workspace.getConfiguration("print", null);
  let cmd = printConfig.alternateBrowser && printConfig.browserPath ? `"${printConfig.browserPath}"` : browserLaunchMap[process.platform];
  child_process.exec(`${cmd} http://localhost:${port}/`);
}

function getFileText(fname: string): string {
  // vscode.window.showInformationMessage(`vsc-print get ${fname}`);

  var text = fs.readFileSync(fname).toString();
  // strip BOM when present
  // vscode.window.showInformationMessage(`vsc-print got ${fname}`);
  return text.indexOf('\uFEFF') === 0 ? text.substring(1, text.length) : text;
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

async function getSourceCode(file: string, fileMatcher: ((document: vscode.TextDocument) => boolean) | null = null): Promise<SourceCode | null> {
  const fileUri = vscode.Uri.file(file);
  const editor = vscode.window.activeTextEditor;
  let editorFsPath = editor ? editor.document.uri.fsPath : undefined;
  let pathsMatch = editorFsPath === file;

  try {
    let otd = (editor && pathsMatch) ? editor.document : await vscode.workspace.openTextDocument(fileUri);
    if (fileMatcher !== null && !fileMatcher(otd)) {
      return null;
    }

    let code;
    if (!selection || selection.isEmpty || !pathsMatch) {
      code = otd.getText();
    } else {
      code = otd.getText(new vscode.Range(selection.start, selection.end)).replace(/\s*$/, "");
    }
    code = code.trimRight();

    // Get relative path if file is in workspace
    const workspace = vscode.workspace.getWorkspaceFolder(fileUri);
    if (workspace) {
      file = path.relative(workspace.uri.fsPath, file);
    }

    return new SourceCode(file, code, otd.languageId);
  }
  catch (err) {
    return err;
  }
}

// properly open/close syntax highlighting spans across line breaks
// necessary for e.g. multiline comments, otherwise the span is broken across tr/td
// maintains a stack of classes, and pushes/pops them upon seeing <span> and </span> tags
// for each line, adds in the appropriate <span>s at the beginning and </span>s at the end
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
    while((spanMatch = spanRegex.exec(line)) !== null) {
      if(spanMatch[1] !== "") {
        classes.pop();
        continue;
      }
      let attrMatch;
      tagAttrRegex.lastIndex = 0;
      while((attrMatch = tagAttrRegex.exec(spanMatch[2])) !== null) {
        if(attrMatch[1].toLowerCase().trim() === "class") {
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

async function getRenderedSourceCode(filePath: string): Promise<string> {
  const printConfig = vscode.workspace.getConfiguration("print", null);
  const printFilenames = printConfig.folder.fileNames;
  let printAndClose = printConfig.printAndClose ? " onload = \"window.print();\" onafterprint=\"window.close();\"" : "";

  if (printConfig.renderMarkdown && filePath.toLowerCase().split('.').pop() === "md") {
    let markdownConfig = vscode.workspace.getConfiguration("markdown", null);
    let raw = fs.readFileSync(filePath).toString();
    let content = md.render(raw);
    try {
      // 1 - prepend base local path to relative URLs
      let a = filePath.replace(/\\/g, "/"); // forward slashes only, they work on all platforms
      let b = a.substring(0, a.lastIndexOf("/")); // clip file name
      let c = b.replace(/([a-z]):/i, "$1C/O/L/O/N"); // escape colon on Windows
      content = content.replace(/(img src=")(?!http[s]?)(?![a-z]:)([^"]+)/gi, `$1${c}/$2`);
      // 2 - escape colon in embedded file paths
      content = content.replace(/(img src="[a-z]):([^"]*)/gi, `$1C/O/L/O/N/$2`);
    } catch (error) {
      debugger;
    }
    let result = `<!DOCTYPE html><html><head><title>${filePath}</title>
    <meta charset="utf-8"/>
    <style>
    html, body {
      font-family: ${markdownConfig.preview.fontFamily};
      font-size: ${markdownConfig.preview.fontSize}px;
      line-height: ${markdownConfig.preview.lineHeight}em;
    }
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

  let x = vscode.extensions.getExtension("pdconsec.vscode-print");
  if (!x) { throw new Error("Cannot resolve extension. Has the name changed? It is defined by the publisher and the extension name defined in package.json"); }

  let stylePath = `${x.extensionPath}/node_modules/highlight.js/styles`;
  let defaultCss = getFileText(`${stylePath}/default.css`);
  let swatchCss = getFileText(`${stylePath}/${printConfig.colourScheme}.css`);

  // Fetch source code for directory or single file
  let codePromises: Promise<SourceCode | null>[];
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    const excludes = printConfig.folder.exclude;
    const include = printConfig.folder.include;
    const gitignore = printConfig.folder.gitignore;

    let patterns = [];
    if (include.length === 0) {
      patterns.push("**/*.*");
    }
    else {
      patterns.push(...include);
    }

    if (excludes.length > 0) {
      patterns.push(...(excludes.map((x: string) => "!" + x)));
    }

    const maxLineCount = printConfig.folder.maxLines;
    const matcher = (document: vscode.TextDocument): boolean => document.lineCount < maxLineCount;

    codePromises = await globby(patterns, {
      gitignore,
      cwd: filePath
    }).then(x => x.map(y => getSourceCode(path.join(filePath, y), matcher)));
  } else {
    codePromises = [getSourceCode(filePath)];
  }
  // Wait for all code to load
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
        .map((line, i) => `<tr><td class="line-number">${startLine + i}</td><td class="line-text">${line}</td></tr>`)
        .join("\n")
        .replace("\n</td>", "</td>")
        ;
    } else {
      renderedCode = renderedCode
        .split("\n")
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
  let html = `<html><head><title>${filePath}</title><meta charset="utf-8"/>
  <style>
    body{
      margin:0;padding:0;tab-size:${editorConfig.tabSize}
    }
    ${defaultCss}
    ${swatchCss}
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

function startWebserver(generateSource: () => Promise<string>): Promise<void> {
  return new Promise(async (resolve, reject) => {
    // prepare to service an http request
    server = http.createServer(async (request, response) => {
      try {
        if (request.url) {
          if (request.url === "/") {
            response.setHeader("Content-Type", "text/html");
            let html = await generateSource();
            response.end(html);
          } else {
            let filePath: string = request.url.substr(1).replace(/C\/O\/L\/O\/N/g, ":");
            let cb = fs.statSync(filePath).size;
            let lastdotpos = request.url.lastIndexOf('.');
            let fileExt = request.url.substr(lastdotpos + 1);
            response.setHeader("Content-Type", `image/${fileExt}`);
            response.setHeader("Content-Length", cb);
            fs.createReadStream(filePath).pipe(response);
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
            vscode.window.showErrorMessage("ACCESS DENIED ESTABLISHING WEBSERVER");
            break;
          default:
            vscode.window.showErrorMessage(`UNEXPECTED ERROR: ${err.code}`);
        }
      }
    });
    server.on("listening", () => {
      port = (server!.address() as AddressInfo).port;
      resolve();
    });
    let printConfig = vscode.workspace.getConfiguration("print", null);
    server.listen();
  });
}

export function deactivate() {
  if (server) { server.close(); }
}
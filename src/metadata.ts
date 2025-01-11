import * as path from "path";
import * as fs from "fs";
import * as vscode from "vscode";

export class Metadata {
  static ExtensionPath: string = (() => {
    const root = vscode.extensions.getExtension("pdconsec.vscode-print")!.extensionPath;
    const dist = path.join(root, "dist");
    try {
      fs.accessSync(dist, fs.constants.F_OK)
      return dist;
    } catch (error) {
      return root;
    }
  })();

  static ExtensionContext: vscode.ExtensionContext;
}
import * as vscode from 'vscode';
import { logger } from './logger';

const settingsMigration = {
  "logLevel": "general.logLevel",
  "filepathHeadingForIndividuallyPrintedDocuments": "general.filepathHeadingForIndividuallyPrintedDocuments",
  "filepathInDocumentTitle": "general.useFilepathInDocumentTitle",
  "filepathAsDocumentHeading": "general.filepathStyleInHeadings",
  "editorContextMenuItemPosition": "general.editorContextMenu.itemPosition",
  "editorTitleMenuButtonPrint": "general.editorTitleMenu.showPrintIcon",
  "editorTitleMenuButtonPreview": "general.editorTitleMenu.showPreviewIcon",
  "alternateBrowser": "browser.useAlternate",
  "browserPath": "browser.alternateBrowserPath",
  "lineSpacing": "sourcecode.lineSpacing",
  "fontSize": "sourcecode.fontSize",
  "lineNumbers": "sourcecode.lineNumbers",
  "colourScheme": "sourcecode.colourScheme",
  "stylesheets.sourcecode": "sourcecode.stylesheets",
  "stylesheets.plaintext": "plaintext.stylesheets",
  "folder.fileNames": "folder.fileNames",
  "folder.include": "folder.include",
  "folder.exclude": "folder.exclude",
  "folder.maxLines": "folder.maxLines",
  "folder.maxFiles": "folder.maxFiles",
  "folder.includeFileList": "folder.includeFileList",
  "renderMarkdown": "markdown.enableRender",
  "stylesheets.markdown": "markdown.stylesheets",
  "documentSettleMilliseconds": "markdown.SettleMs",
  "useSmartQuotes": "markdown.useSmartQuotes",
  "krokiUrl": "markdown.kroki.url",
  "includePaths": "markdown.kroki.includePaths",
  "rejectUnauthorisedTls": "markdown.kroki.rejectUnauthorisedTls"
};

export default async function migrateSettings() {
  const config = vscode.workspace.getConfiguration();
  for (const [oldKey, newKey] of Object.entries(settingsMigration)) {
    const prefixedOldKey = `print.${oldKey}`;
    const prefixedNewKey = `print.${newKey}`;
    const oldValue = config.get(prefixedOldKey);
    if (typeof oldValue === "undefined") {
      logger.debug(`Settings migration: ${prefixedOldKey} was not set`);
    } else {
      logger.debug(`Settings migration: copied ${prefixedOldKey} = ${oldValue} to ${prefixedNewKey}`);
      await config.update(prefixedNewKey, oldValue, vscode.ConfigurationTarget.Global);
      // don't remove the old values in case the user wants to revert
      // await config.update(prefixedOldKey, undefined, vscode.ConfigurationTarget.Global);
    }
  }
}
import * as vscode from 'vscode';

const settingsMigration = {
  "logLevel": "general.logLevel",
  "filepathHeadingForIndividuallyPrintedDocuments": "general.filepathHeadingForIndividuallyPrintedDocuments",
  "filepathAsDocumentHeading": "multifile.useFilepathAsDocumentHeading",
  "filepathInDocumentTitle": "useFilepathInDocumentTitle",
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
    const oldValue = config.get(oldKey);
    if (oldValue !== undefined) {
      await config.update(newKey, oldValue, vscode.ConfigurationTarget.Global);
      await config.update(oldKey, undefined, vscode.ConfigurationTarget.Global);
    }
  }
}
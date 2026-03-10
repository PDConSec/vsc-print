import * as vscode from 'vscode';
import { logger } from './logger';

/**
 * Settings migration for vscode-print extension.
 * 
 * This maps old setting keys to their current equivalents across multiple extension versions.
 * Due to VS Code's configuration system, we can only write to keys that are explicitly 
 * declared in package.json. This means intermediate keys from old refactoring steps must
 * either be registered in package.json (with deprecationMessage) or skipped entirely.
 * 
 * All source keys map directly to their final registered destination. Intermediate keys
 * from previous refactoring steps (e.g. "browser.useAlternate", "browser.alternateBrowserPath")
 * are also included as explicit source entries so that users who have these intermediate
 * keys in their settings.json are properly migrated to the current key names.
 */
const settingsMigration: Record<string, string> = {
  "logLevel": "general.logLevel",
  "filepathHeadingForIndividuallyPrintedDocuments": "general.filepathHeadingForIndividuallyPrintedDocuments",
  "filepathInDocumentTitle": "general.useFilepathInDocumentTitle",
  "filepathAsDocumentHeading": "general.filepathStyleInHeadings",
  "editorContextMenuItemPosition": "general.editorContextMenu.itemPosition",
  "editorTitleMenuButtonPrint": "general.editorTitleMenu.showPrintIcon",
  "editorTitleMenuButtonPreview": "general.editorTitleMenu.showPreviewIcon",
  "alternateBrowser": "alternateBrowser.enable",
  "browserPath": "alternateBrowser.path",
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
  "useSmartQuotes": "markdown.smartQuotes.enable",
  "krokiUrl": "markdown.kroki.url",
  "includePaths": "markdown.kroki.includePaths",
  "rejectUnauthorisedTls": "markdown.kroki.rejectUnauthorisedTls",
  // Intermediate keys from the 1.3.x refactoring that were renamed again in 1.4.0
  "browser.alternateBrowserPath": "alternateBrowser.path",
  "browser.useAlternate": "alternateBrowser.enable",
  "markdown.useSmartQuotes": "markdown.smartQuotes.enable",

};

/**
 * Get all source keys that need migration.
 * 
 * Returns all keys in the migration map that are not self-referential (i.e. where
 * the source key differs from the target key). Self-referential entries are no-ops
 * used as documentation placeholders.
 * 
 * This deliberately includes intermediate keys (e.g. "browser.useAlternate") so
 * that users who received those keys from an earlier migration run will also have
 * their settings cleaned up and migrated to the current key names.
 * 
 * @returns Array of source keys that need migration
 */
function getSourceKeys(): string[] {
  return Object.keys(settingsMigration).filter(key => settingsMigration[key] !== key);
}

/**
 * Migrate user settings from old keys to current keys.
 * 
 * VS Code only allows writing to configuration keys that are explicitly declared
 * in the extension's package.json. All source keys in the migration map point
 * directly to their final registered destination key.
 * 
 * This approach ensures we only write to registered configuration keys while still
 * supporting users upgrading from any historical version of the extension.
 * 
 * Error handling is included because some old keys might not be registered
 * (e.g., intermediate keys from a previous refactoring) and deletion may fail.
 */
export default async function migrateSettings() {
  const config = vscode.workspace.getConfiguration();
  
  const sourceKeys = getSourceKeys();
  
  for (const sourceKey of sourceKeys) {
    const targetKey = settingsMigration[sourceKey];
    const prefixedOldKey = `print.${sourceKey}`;
    const prefixedNewKey = `print.${targetKey}`;
    
    const oldValue = config.get(prefixedOldKey);
    if (typeof oldValue !== "undefined") {
      logger.debug(`Settings migration: found ${prefixedOldKey} = ${oldValue} (${typeof oldValue})`);
      
      // Check if the new key already has a value and compare types
      const newValue = config.get(prefixedNewKey);
      const shouldMigrate = typeof newValue === "undefined" || typeof oldValue === typeof newValue;
      
      if (shouldMigrate) {
        logger.debug(`Settings migration: copying ${prefixedOldKey} = ${JSON.stringify(oldValue)} to ${prefixedNewKey}`);
        try {
          await config.update(prefixedNewKey, oldValue, vscode.ConfigurationTarget.Global);
          logger.info(`Settings migration: migrated ${prefixedOldKey} = ${JSON.stringify(oldValue)} to ${prefixedNewKey}`);
          
          // Delete the old key after successful migration
          try {
            await config.update(prefixedOldKey, undefined, vscode.ConfigurationTarget.Global);
          } catch (deleteError) {
            logger.warn(`Settings migration: could not remove old key ${prefixedOldKey}: ${deleteError}`);
          }
        } catch (error) {
          logger.warn(`Settings migration: failed to migrate ${prefixedOldKey} to ${prefixedNewKey}: ${error}`);
        }
      } else {
        logger.warn(`Settings migration: type mismatch - ${prefixedOldKey} (${typeof oldValue}) cannot migrate to ${prefixedNewKey} (${typeof newValue})`);
      }
    } else {
      logger.debug(`Settings migration: ${prefixedOldKey} was not set`);
    }
  }
}
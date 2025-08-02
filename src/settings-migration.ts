import * as vscode from 'vscode';
import { logger } from './logger';

/**
 * Settings migration chains for vscode-print extension.
 * 
 * This maps old setting keys to their newer equivalents across multiple extension versions.
 * Due to VS Code's configuration system, we can only write to keys that are explicitly 
 * declared in package.json. This means we cannot use intermediate migration steps that
 * create temporary keys, as they would fail with "not a registered configuration" errors.
 * 
 * Instead, we resolve the full migration chain from source to final destination and
 * perform direct migration, skipping any intermediate keys that might not be registered.
 * 
 * Example migration chain:
 * "alternateBrowser" → "browser.useAlternate" → "alternateBrowser.enable"
 * 
 * We detect that "alternateBrowser" is a source key (not a target of any other migration),
 * follow the chain to find the final target "alternateBrowser.enable", and copy directly
 * from "print.alternateBrowser" to "print.alternateBrowser.enable".
 */
const settingsMigration: Record<string, string> = {
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
  "useSmartQuotes": "markdown.smartQuotes.enable",
  "krokiUrl": "markdown.kroki.url",
  "includePaths": "markdown.kroki.includePaths",
  "rejectUnauthorisedTls": "markdown.kroki.rejectUnauthorisedTls",
  //1.4.0
  "browser.alternateBrowserPath": "alternateBrowser.path",
  "browser.useAlternate": "alternateBrowser.enable",
  "markdown.useSmartQuotes": "markdown.smartQuotes.enable",

};

/**
 * Resolve a migration chain to its final target.
 * 
 * Follows the migration mapping from a starting key through any intermediate
 * keys until we reach a key that is not mapped to anything else (the final target).
 * 
 * Uses cycle detection to prevent infinite loops in case of circular references.
 * 
 * @param startKey The key to start resolving from
 * @returns The final target key in the migration chain
 */
function resolveMigrationChain(startKey: string): string {
  let currentKey = startKey;
  const visited = new Set<string>();
  
  while (settingsMigration[currentKey] && !visited.has(currentKey)) {
    visited.add(currentKey);
    currentKey = settingsMigration[currentKey];
  }
  
  return currentKey;
}

/**
 * Get all unique source keys (keys that aren't targets of other migrations).
 * 
 * A source key is an original setting name that users might have in their configuration
 * from older versions of the extension. These are the starting points for migration chains.
 * 
 * We identify them by finding keys in the migration map that are not values (targets)
 * of any other migration mapping.
 * 
 * @returns Array of source keys that need migration
 */
function getSourceKeys(): string[] {
  const allTargets = new Set(Object.values(settingsMigration));
  return Object.keys(settingsMigration).filter(key => !allTargets.has(key));
}

/**
 * Migrate user settings from old keys to current keys.
 * 
 * VS Code only allows writing to configuration keys that are explicitly declared
 * in the extension's package.json. This prevents us from using a simple iterative
 * approach that might create intermediate keys during migration.
 * 
 * Instead, we:
 * 1. Identify all source keys (original setting names from old versions)
 * 2. Resolve each source key to its final target through the migration chain
 * 3. Copy values directly from source to final destination, skipping intermediates
 * 
 * This approach ensures we only write to registered configuration keys while still
 * supporting users upgrading from any historical version of the extension.
 * 
 * Error handling is included because some target keys might not be registered
 * (e.g., during development or if package.json is out of sync).
 */
export default async function migrateSettings() {
  const config = vscode.workspace.getConfiguration();
  
  // Get all source keys and resolve them to their final targets
  const sourceKeys = getSourceKeys();
  
  for (const sourceKey of sourceKeys) {
    const finalTarget = resolveMigrationChain(sourceKey);
    const prefixedOldKey = `print.${sourceKey}`;
    const prefixedNewKey = `print.${finalTarget}`;
    
    const oldValue = config.get(prefixedOldKey);
    if (typeof oldValue !== "undefined") {
      logger.debug(`Settings migration: found ${prefixedOldKey} = ${oldValue} (${typeof oldValue})`);
      
      // Check if the new key already has a value and compare types
      const newValue = config.get(prefixedNewKey);
      const shouldMigrate = typeof newValue === "undefined" || typeof oldValue === typeof newValue;
      
      if (shouldMigrate) {
        logger.debug(`Settings migration: copying ${prefixedOldKey} = ${oldValue} to ${prefixedNewKey} (final target)`);
        try {
          await config.update(prefixedNewKey, oldValue, vscode.ConfigurationTarget.Global);

          // Log the old key and value before deletion
          logger.info(`Settings migration: deleted ${prefixedOldKey} with value: ${JSON.stringify(oldValue)}`);
          
          // Delete the old key after successful migration
          await config.update(prefixedOldKey, undefined, vscode.ConfigurationTarget.Global);
          
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
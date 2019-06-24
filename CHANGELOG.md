# Change Log
All notable changes to the "VSCODE-PRINT" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

### 0.7.7
- #33 The editor tab-size setting was incorrectly retrieved and therefore not respected. This has now been corrected.
- #34 Printing was failing for direct invocation (press `F1` then type Printing: Print finally press `Enter`). This has now been corrected.

### 0.7.6
- Localised to French.
- The Russian "localisation" is a stub (still in English) pending translations.
- Menu and icon availability now determined from editorLangId rather than resourceLangId. This should allow printing of unsaved documents and unrecognised file types per issues 31 and 32.

### 0.7.1
Now using VS Code's markdown rendering pipeline.
- faster load
- smaller memory footprint
- markdown extensions like [Markdown+Math](https://marketplace.visualstudio.com/items?itemName=goessner.mdmath) take effect when printing

### 0.7.0
- Bump minor version as 0.6.13 introduced new settings changing the UX
- Fix support for extended character sets and mixed languages in printed source code (#29) with thanks to Ekgart Vikentiy for reporting this.

### 0.6.13
Stub release because there's no other way to make the marketplace update the readme file.

### 0.6.12
- Settings to allow the user to move the range in which the embedded webserver chooses ports
- Moved default port range into the correct range for dynamic ports (was library default)
- Separate manual thanks to Nat Kuhn

## 0.6.9
- UTF-8 for extended charsets.
- Support images on local paths.

## 0.6.8
- Control whether the embedded web server announces which port it acquires (off by default).
- Render Markdown with the same engine VS Code uses for preview.

## 0.6.7
Report acquired port to user with toast.

## 0.6.5
- Context menu position is now a setting.
- New store graphics.

## 0.6.2
Apply categories to commands.

## 0.6.1
Documentation tweak.

## 0.6.0
- Colour scheme stylesheet setting is no longer presented as a combo-box. Instead, there is a command that presents a file-browse dialog and updates the setting.
- Language detection falls back to highlightjs when VS Code produces an incompatible language identifier.

## 0.5.3
- Tab size respects editor setting.
- Responsibility for language detection moved from highlightjs to VS Code.

## 0.5.2
Fixed free-port finder for embedded webserver.

## 0.5.1
- Apply styling to rendered markdown when printing.
- Moved default internal webserver port away from the start of the dynamic port range to reduce the chance of collision. When a collision occurs there is an automatic adjustment but there is a bug requiring manual retry.

## 0.5.0
Render markdown when printing.

## 0.4.0
- Fix page-breaking by dropping @page margins and delegating margin control to the browser.
- Port allocation is now dynamic.

## 0.3.0
- An option has been added to enable/disable the alternate browser so it can be disabled without losing the path.
- An option has been added to enable/disable automatic opening of the print dialog and closing of the page tab after printing is done or cancelled.
- The setting `stylesheet` has been renamed to `colourScheme` to move it nearer the start of settings and more clearly convey the purpose of the setting.

## 0.2.5
- Initial release
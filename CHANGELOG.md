# Change Log

### 0.9.31

- Control logging level with setting
- Update documentation and localisation 

### 0.9.30

- Add diagnostic logging

### 0.9.29

- Fix content source analysis
- Fix printing of never-saved editor buffer
- Add regression test for printing never-saved editor buffer

### 0.9.28

- Update references to eliminate vulnerabilities.
- Register ES, ZH localisation resources for UI [#145](https://github.com/PDConSec/vsc-print/issues/145)

### 0.9.27

- Fix printing of a selection [#142](https://github.com/PDConSec/vsc-print/issues/142)

### 0.9.26

- Unit tests and integration tests, with extensive supporting changes.

### 0.9.22 

- Fix broken path escaping on Windows

### 0.9.18

- Fix selection printing
- Minor documentation update

### 0.9.16

- Addressed issue 126 - overhaul embedded webserver
- This resolves markdown styling issues 122 and 123

### 0.9.15

- Fixed issue 98 - print Markdown rendered from unsaved files

### 0.9.14

- Emergency bugfix for printing unsaved files
- Emergency bugfix for printing files with Azure Uris that are not backed by a complete filesystem

### 0.9.13

- Emergency bugfix for printing a selection

### 0.9.12

- Emergency bugfix for resolution of local resources referenced by Markdown

### 0.9.11

- Total rewrite of file management in support of remote file systems
- Glob brace expressions can be nested
- Exclusion is forced for
  - `**/*.{exe,dll,pdb,pdf,hex,bin,png,jpg,jpeg,gif,bmp}` 
  - `{bin,obj}`
- Change to licence terms refusing licence to persons who give a bad review without first reading the manual or seeking assistance by raising an issue on the GitHub repository

### 0.9.10

- this version number was used for an internal release

### 0.9.9

- Localise messages
- Improved settings UX for folder print exclusion and inclusion glob lists
- Guarantee exclusion of known unprintable file types
- Embed stylesheets and improve stylesheet setting UX
- New settings for customisation of Markdown rendering

### 0.9.8

- Adjust tag line to ensure that Markdown is mentioned when it is clipped.
- Capitalise all references to Markdown in readme file.

### 0.9.7

- Fix missing assets due to broken update in Microsoft's extension packaging and publishing tool (reversion to an earlier version resolved the missing assets)

### 0.9.6

- Change marketplace tag line.

### 0.9.5

- Security updates
- Work-around new bug in nodejs. The error handler is now always invoked when the browser is launched, and it is necessary to check whether the error object is null. This has caused spurious errors to be reported even though printing succeeds.
- Update readme to promote the (apparently rare) ability to print rendered Markdown. Thanks to Andy Barratt for suggesting this in his review.

### 0.9.4

- Update assets to compensate changes in Visual Studio Code 1.56
- PR101 display error message when browser launch fails, fix thanks to [baincd](https://github.com/baincd)
- PR97 rendered Markdown path fixes, fix thanks to [baincd](https://github.com/baincd)
- PR96 correct extensionKind UI setting in package.json, fix thanks to [baincd](https://github.com/baincd)
- PR94 update README to clarify browser differences and recommendation, fix thanks to [baincd](https://github.com/baincd)
- PR92 webserver timeout, fix thanks to [baincd](https://github.com/baincd)

### 0.9.3

- Further updates for language support
- Issue 88 Trying to print a new file that does not exist in the filesystem would cause an error message, a regression caused by internal changes in support of folder printing, fix thanks to [baincd](https://github.com/baincd)
- Issue 87 Blank lines don't print correctly, fix thanks to [baincd](https://github.com/baincd)

### 0.9.2

- Correct missing translations and documentation.

### 0.9.0

- Various dependencies updated to mitigate security risks.
- Syntax colouring fix for multi-line strings and comments, thanks to [gji](https://github.com/gji) closes #85 and #63
- Changed default stylesheet from vs2015 (a dark theme) to Atelier Dune.
- Added support for printing entire folders thanks to [alainx277](https://github.com/Alainx277).

### 0.8.2

- Removed port acquisition announcement setting as ports are no longer under user control.
- Corrected issue 68, an exception occurring when printing an editor buffer that does not have a corresponding file on disk, by typing the command.

### 0.8.1

- Because the host operating system now chooses the port for the embedded webserver, the webserver is created on first use and retained until the extension deactivates, so that the port allocation does not change. Code to decommissione the webserver after processing a request was not removed in 0.8.0 and is removed in 0.8.1 removing the risk of an unexpected change of port.

### 0.8.0

- Various issues describing high CPU use at extension startup are resolved by use of Webpack. 
- Port selection for the embedded webserver is now fully delegated to the host operating system. As a result the port range settings are no longer necessary and have been removed.
- No longer dependent on the portfinder package.

### 0.7.15

- Issue 64 - local images were broken because Microsoft changed VS Code. Markdown rendering no longer rewrites resource references to prefixed filepaths, they are now passed through unchanged. The extension now handles mapping to the filesystem.

### 0.7.14

- Issue 51 - support for WSL courtesy of [sburlap](https://github.com/sburlappp)
- Issue 54 - respect editor font when printing code

### 0.7.13

- Issue 48 - fix MD image path glitch.
- Update dependencies to address known vulnerabilities.

### 0.7.12

- Issue 40 - prevent double file extension producing an unhandled exception in the page generator stalling the embedded webserver resulting in an empty white browser window for a page load that does not complete.
- Issue 41 - handle unexpected exceptions in the page generator by delivering the error stack as the page content, thereby vastly improving diagnostic information in issues.

### 0.7.13

- Issue 48 - fix MD image path glitch.
- Update dependencies to remove known vulnerabilities.

### 0.7.12

- Issue 40 - prevent double file extension producing an unhandled exception in the page generator stalling the embedded webserver resulting in an empty white browser window for a page load that does not complete.
- Issue 41 - handle unexpected exceptions in the page generator by delivering the error stack as the page content, thereby vastly improving diagnostic information in issues.

### 0.7.11

- Issue 39 - correction to inappropriately scoped regular expression causing colons to be escaped in the entire document when they should be escaped only in URLs.

### 0.7.9

- Issue 36 - corrected a problem with the internal rendering pipeline rewriting URLs to use a vscode internal protocol. This caused image references to work in the preview but not in the browser.

### 0.7.8

- Issue 35 - stylesheet cache path incorrectly constructed on non-Windows file systems. This has now been corrected.

### 0.7.7
- Issue 33 - the editor tab-size setting was incorrectly retrieved and therefore not respected. This has now been corrected.
- Issue 34 - printing was failing for direct invocation (press `F1` then type Printing: Print finally press `Enter`). This has now been corrected.

### 0.7.6
- Localised to French.
- The Russian "localisation" is a stub (still in English) pending translations.
- Menu and icon availability now determined from editorLangId rather than resourceLangId. This should allow printing of unsaved documents and unrecognised file types per issues 31 and 32.

### 0.7.1
Now using VS Code's Markdown rendering pipeline.
- faster load
- smaller memory footprint
- Markdown extensions like [Markdown+Math](https://marketplace.visualstudio.com/items?itemName=goessner.mdmath) take effect when printing

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
- Apply styling to rendered Markdown when printing.
- Moved default internal webserver port away from the start of the dynamic port range to reduce the chance of collision. When a collision occurs there is an automatic adjustment but there is a bug requiring manual retry.

## 0.5.0
Render Markdown when printing.

## 0.4.0
- Fix page-breaking by dropping @page margins and delegating margin control to the browser.
- Port allocation is now dynamic.

## 0.3.0
- An option has been added to enable/disable the alternate browser so it can be disabled without losing the path.
- An option has been added to enable/disable automatic opening of the print dialog and closing of the page tab after printing is done or cancelled.
- The setting `stylesheet` has been renamed to `colourScheme` to move it nearer the start of settings and more clearly convey the purpose of the setting.

## 0.2.5
- Initial release
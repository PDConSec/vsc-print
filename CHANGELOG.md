# Change Log

### 1.6.1

- Enhanced settings migration with type checking and old key cleanup
- Added CSS file path validation test for highlight.js themes
- Fixed color scheme mappings to handle highlight.js package updates

### 1.6.0

- Add support for absolute filesystem paths with special path symbol 'absolute/path/to/file.css'
- Show warning with help link when CSS, image, or SVG file resolution fails

### 1.5.2

- settings should be print.alternateBrowser.path and print.alternateBrowser.enable

### 1.5.1

- fix marshalling of options to SMILES

### 1.5.0

- fix [#387](https://github.com/PDConSec/vsc-print/issues/387)
- fix SMILES and support config (see manual)

### 1.4.1

- fix [#386](https://github.com/PDConSec/vsc-print/issues/386)
- fix [#387](https://github.com/PDConSec/vsc-print/issues/387)

### 1.4.0

- Security updates
- Rename browser settings
- Finish localising walkthrough files
- Watermark support
- Prevent highlightjs from setting a background colour

### 1.3.0

- [#378](https://github.com/PDConSec/vsc-print/issues/378)
  - optional pagebreak between files
  - update localisation and support localisation of walkthroughs
  - rename settings to group them in the settings editor

### 1.2.1 

- Remove gulp, gulp-typescript from package.json and bundle

### 1.2.0

- Fixed [#376](https://github.com/PDConSec/vsc-print/issues/376)
- Hot preview now extends to Print's Markdown Stylesheets list and the stylesheets themselves

### 1.1.0

- SmartQuote support in rendered Markdown, setting on by default
- Fixed event binding in preview
- When you double-click a element in hot preview, in addition to selecting the source Markdown in the editor the rendered element is highlighted

### 1.0.0

- Switch to semver numbering
- When the alternate browser option is enabled and your alternate browser path is invalid you 
  will be prompted to choose a browser. This works using a database of the default locations 
  for all the major browsers for all three platforms and then probing to see what you actually
  have. If you have a browser and it doesn't show up then it's not on the standard path. 

### 0.14.2

- replace atob and btoa with more robust alternatives

### 0.14.1

- fix [#365](https://github.com/PDConSec/vsc-print/issues/365) 
  - preview mapping to source
  - broken path to manual, now uses browser preview instead of VS Code's embedded Markdown preview
  - manual command is localised falling back to English; translation of manual to follow
  - line-numbers.css no longer incorrectly sets body font-family
- fix [#364](https://github.com/PDConSec/vsc-print/issues/364) doc refresh and missing rate limit setting

### 0.14.0

- fix [#359](https://github.com/PDConSec/vsc-print/issues/359)
- hot preview [#332](https://github.com/PDConSec/vsc-print/issues/332)

### 0.13.3

- fix [#357](https://github.com/PDConSec/vsc-print/issues/357) filepath heading style should not affect all h3

### 0.13.2

- fix [#352](https://github.com/PDConSec/vsc-print/issues/352) Improved Katex handling of broken syntax - instead of aborting the page render and displaying an error message in the browser, the Katex block is partially rendered and the invalid syntax is shown in red.
- Improved default styling of tables. People, that was _awful_, why didn't anyone comment?

### 0.13.1

- fix [#342](https://github.com/PDConSec/vsc-print/issues/342) KaTeX expressions were combined due to incorrect greedy-match in regex
- updates to the manual

### 0.13.0

- fix [#343](https://github.com/PDConSec/vsc-print/issues/343) [#342](https://github.com/PDConSec/vsc-print/issues/342) via adoption of handlebars for templating
- feat: [#340](https://github.com/PDConSec/vsc-print/issues/340) database diagram support contributed by Ashton Abdiukov

### 0.12.16

- fix print button for non-Markdown (don't apply SmilesDrawer unless it was delivered to the page)
- [#302](https://github.com/PDConSec/vsc-print/issues/302) Line numbers starting from cursor position

### 0.12.15

- support for recursive `!include` directives in Kroki diagrams (subject to GET limits)

### 0.12.14

- [#335](https://github.com/PDConSec/vsc-print/issues/335) map doesn't play  well with async functions

### 0.12.13

- persistent cache for rendered diagrams

### 0.12.12

- async resolver caching proxy for generated resources so diagram rendering does not stall page delivery
- add option reject unauthorised TLS defaulting to true

### 0.12.10

- added logs for Kroki failures

### 0.12.9

- fix diagram type source escaping
- fix lang values for DOT and VEGALITE
- fix NRE for unspecified lang

### 0.12.8

- emergency bugfix for missing end of img tag in Kroki handling

### 0.12.7

- [#329](https://github.com/PDConSec/vsc-print/issues/329) - syntax coloured source in Markdown fenced blocks
- [#328](https://github.com/PDConSec/vsc-print/issues/328) - user supplied CSS

### 0.12.5

- [#326](https://github.com/PDConSec/vsc-print/issues/326) - support for Kroki
  - this unifies the rendering of a large number of diagram notations, notably Mermaid and C4
  - Kroki is server based. In line with our philosophy of off-line operation, there is a setting for the URL of the Kroki server and a link in the setting description to instructions for setting up a local installation of Kroki.
- [#324](https://github.com/PDConSec/vsc-print/issues/324) - Reworked Katex integration to support
  - `$$` fenced display blocks
  - `$%...%$` inline equations
  - # MHCHEM equations
- [#327](https://github.com/PDConSec/vsc-print/issues/327) - separate settings for visibility of print and preview icons
- localised several recently added settings
- [#287](https://github.com/PDConSec/vsc-print/issues/287) = new scheme [none] is black and white

### 0.12.3

- Separate print and preview buttons and menu items
- Print and Close setting removed
- No longer dependent on VS Code's built in Print rendering pipeline
- Baked-in support for Mermaid ([#263](https://github.com/PDConSec/vsc-print/issues/263))
- Baked-in support for LaTeX with all CSS and font resources served out of the extension
- [#305 Use editor typeface setting](https://github.com/PDConSec/vsc-print/issues/305)
- Installable document renderer API getBodyHtml is now async to support the use of await with libraries
- Support for defining Mermaid and Katex rendering options in-line in Markdown

### 0.11.28

- [#308](https://github.com/PDConSec/vsc-print/issues/308) editor font settings apply to plaintext
- Per #309 discussion plaintext documents should wrap

### 0.11.27

- [#297 Update unit test support](https://github.com/PDConSec/vsc-print/issues/297)
- [#298 Update localisation support](https://github.com/PDConSec/vsc-print/issues/298)
- We are now targetting all 19 languages for which Language Packs are available
- [#299 webpack 5 and highlightjs 11 compatibility problems](https://github.com/PDConSec/vsc-print/issues/299)
- [#293 Update GitHub workflows and action versions](https://github.com/PDConSec/vsc-print/issues/293)
- [#290 Printing from command palette prints only whole document not selection](https://github.com/PDConSec/vsc-print/issues/290)

### 0.11.18

- #274 close vulnerability
- change tags

### 0.11.17

- #272 bugfix

### 0.11.16

- Line breaking bugfix

### 0.11.14

- Support for document renderers to linking and serving script files
- Support for document renderers to obtain document state when generating settings driven CSS or script
- Changes to package.json to link various capabilities from the marketplace page

### 0.11.11

- pass root document uri in renderer options
- use raw-loader for template files so they don't minify (debugging aid)
- [#243 No active editor makes line number inherit resolve to false](https://github.com/PDConSec/vsc-print/issues/243)

### 0.11.6

- diagnostic commands "Dump commands" and "Dump properties" for resolving name collisions with commands and properties

### 0.11.4

- [#234 Support line-numbering for multifile printjobs](https://github.com/PDConSec/vsc-print/issues/234)

### 0.11.3

- [#212 Broken removal of MarkdownIT embedded styles](https://github.com/PDConSec/vsc-print/issues/212)
- [#208 Context menu for file explorer does not respect Print item position](https://github.com/PDConSec/vsc-print/issues/208)
- [#207 Line Numbers "Inherit" not working as expected](https://github.com/PDConSec/vsc-print/issues/207)

### 0.11.2

- [#203 `DOCUMENT_HEADING` not being replaced when printing folders](https://github.com/PDConSec/vsc-print/issues/203)

### 0.11.1

- [#198 How to remove the file path as document heading?](https://github.com/PDConSec/vsc-print/issues/198)

### 0.11.0

- #187 bugfixes
  - don't force alternate browser on
  - fix alternate browser path check logic
- #194 add a renderer for plaintext documents so they aren't treated as source code
- #184 filepath as header at start of document (controlled by a setting)
- #184 format control for file paths in headings of documents
  - Relative
  - Absolute, with tilde pathing for paths in the user's home directory
- #188 format control for file paths in document titles (used in page headers by some browsers)
  - No path
  - Relative

Please note that localisation has not been done for these UI changes due to delays in development of localisation management toolchain.

### 0.10.22

- support for walkthrough
- fix #181 use editor font when printing source code (broken by refactoring)
- fix #182 file explorer context-menu print now supports multiselection
- fix #183 unexpected commas

### 0.10.20

- API support providing print and preview services to other extensions. Internal renderers now use the API.
- Colour samples when printing CSS source code (as for VS Code editor).
- Changes to browser launch method to work around broken command routing.
- Default browser works for local and remote but alternate browser is currently available only for local workspaces.

### 0.10.7

- Urdu localisation
- Enhanced debug logging of printing files from remote filesystems
- Fix typo in internal identifier for Atelier Sulphur
Pool colour scheme

### 0.10.4

- Fixed an issue preventing the selected colour scheme from being applied

### 0.10.1

- Fix broken asset path
- Move localisation credits to end of README.md

### 0.10.0

- Webserver binds only to loopback interface, request origin no longer checked
- More updates to documentation and localisation
  - ancillary documents moved to /doc
  - images etc moved to /assets
- `Print: Open the manual` is now localised, falling back to English
- `Print: Open the log` opens the log file in VS Code for inspection
- New settings
  - `Log Level` controls the minimum severity for log messages
  - `Max Files` limits the number of files that printing a folder can render into a single print job

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
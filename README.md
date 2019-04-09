> In a review (thank you for writing one!) a port collision was reported when running multiple instances of VS Code (the multi-monitor workaround). I have not been able to reproduce this problem in the current version and unfortunately the report did not include version information. This release instruments port acquisition. No telemetry, but _you_ can see what port it tries to use. If anyone experiences this with a current build please tell me about it in as much detail as you can with an issue on the repo.

# Visual Studio Code Printing

Code listings are iconic in a sense older than graphical user interfaces. I can't give you dot-matrix on blue-lined 15" fanfold paper, but I _can_ give you line numbers, and double spacing to allow annotation with a pencil.

![Toolbar snap with print icon](https://user-images.githubusercontent.com/5498936/53408273-d853d480-3a09-11e9-8936-d37189dce8c5.PNG)

The print icon on the toolbar prints the document in the active editor.

If you have a text selection that crosses at least one line-break you can right click and choose Print from the context menu to send just the selection to the printer. In the absence of a multi-line selection the entire document is printed.

![context-menu-editor](https://user-images.githubusercontent.com/5498936/53408378-05a08280-3a0a-11e9-8e88-0088089e0d07.png)

Or you can right-click on a file in the file explorer pane and choose Print from the context menu.

![context-menu-file-explorer](https://user-images.githubusercontent.com/5498936/53408376-05a08280-3a0a-11e9-9912-31e869db64d5.png)

## Features

Printing on Mac, Linux and Windows
* Entirely local in operation, no dependence on cloud services
* Syntax colouring in a wide range of familiar colour schemes that you can import or modify
* Optional line numbering
* Adjustable line spacing (1, 1.5, 2)
* Print a selection of code with line numbers matching the editor
* Specify a browser other than your default

## Requirements

You'll need a web browser and access to a printer.

## Extension Settings

This extension contributes the following settings:

* `print.alternateBrowser`: enable/disable an alternate browser
* `print.browserPath`: the path to a web browser
* `print.colourScheme`: the stylesheet used for colouring syntax
* `print.editorContextMenuItemPosition`: the position of `Print` in the editor context menu
* `print.fontSize`: the font size
* `print.formatMarkdown`: render markdown as styled HTML when printing
* `print.lineNumbers`: on, off or inherit (do same as editor)
* `print.lineSpacing`: single, line-and-a-half or double spaced

## Known Issues
Tab size is now governed by the editor tab size setting. This exploits the experimental CSS `tab-size` property, which works on Opera, Firefox and Chrome, but **not** Edge. When Edge starts using the Chromium engine this will change.

Chrome has a tendency to remember too much about printers, paper sizes and margins especially if you abort. If you try another browser and a problem goes away, it's Chrome helping too much and the solution is to load a web page, change your settings and print something, then exit clean.

## Release Notes

## 0.6.7
Report acquired port to user with toast.

## 0.6.5
- Context menu position is now a setting.
- New store graphics.

## 0.6.2
Fixes command categories so they appear as
- Print: Browse for stylesheet
- Print: Print

The commands are present and functional in 0.6.1 but are not correctly categorised.

Colour scheme stylesheets are no longer selected from a combo-box. Instead there is a new command `Print: Browse for stylesheet` that spawns a file-browse dialog and updates the setting. If you choose a file outside the stylesheet cache it is copied into the cache so you don't become dependent on network-local resources.

Earlier versions occasionally had problems with port collisions causing printing to fail. A manual retry or three always fixed it but this was ugly. Correcting the problem was the primary focus of 0.5.3, and I am pleased to finally remove it from known issues.

Also addressed is [issue #17](https://github.com/PeterWone/vsc-print/issues/17) which moves responsibility for language detection from highlightjs (the library used for syntax colouring) to VS Code, falling back to highlightjs when an incompatible language code is produced.

Microsoft Edge always prompts for permission to close the browser after printing, which can be annoying.
Firefox doesn't prompt, it just plain doesn't close the browser, which is beyond annoying. As a result, Chrome is the recommended browser for printing.

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

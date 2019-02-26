# Visual Studio Code Printing

Code listings are iconic in a sense older than graphical user interfaces. Say no to millennial nonsense and print your code the way God intended (on paper with line numbers). Yes, I know, it really should be faded dot-matrix on blue-lined 15" fanfold paper but what can you do.

![Toolbar snap with print icon](https://user-images.githubusercontent.com/5498936/53408273-d853d480-3a09-11e9-8936-d37189dce8c5.PNG)

The print icon on the toolbar prints the document in the active editor.

If you have a text selection that crosses at least one line-break you can right click and choose Print from the context menu to send just the selection to the printer. In the absence of a multi-line selection the entire document is printed.

![context-menu-editor](https://user-images.githubusercontent.com/5498936/53408378-05a08280-3a0a-11e9-8e88-0088089e0d07.png)

Or you can right-click on a file in the file explorer pane and choose Print from the context menu.

![context-menu-file-explorer](https://user-images.githubusercontent.com/5498936/53408376-05a08280-3a0a-11e9-9912-31e869db64d5.png)

## Features

Printing on Mac, Linux and Windows
* Does not depend on cloud services like CodeMirror
* Syntax colouring in a wide selection of named colour schemes
* Optional line numbering
* Adjustable line spacing
* Print a selection of code with line numbers matching the editor
* Specify a browser other than your default (Edge won't automatically close after printing)

## Requirements

You'll need a web browser and access to a printer.

## Extension Settings

This extension contributes the following settings:

* `print.margin`: the page margin in millimetres
* `print.lineSpacing`: single, line-and-a-half or double spaced
* `print.fontSize`: the font size 
* `print.lineNumbers`: on, off or inherit (do same as editor)
* `print.browserPath`: the path to a webbrowser, leave blank to use your default browser
* `print.port`: the port used by the embedded webserver
* `print.stylesheet`: the stylesheet used for colouring syntax

## Known Issues

The list of stylesheets had to be severely shortened to work around a problem with large lists in VS Code. When handling of large lists is improved the full list of 90 stylesheets will be restored.

## Release Notes

Icons have been updated in both marketplace and the application.

Direct printing will have to wait on changes to my related WebPrint project.

### 0.2.5

Minor packaging fixes

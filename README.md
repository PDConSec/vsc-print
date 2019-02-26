# Visual Studio Code Printing

## Features

Printing on Mac, Linux and Windows
* Does not depend on cloud services like CodeMirror
* Syntax colouring in a wide selection of named colour schemes
* Optional line numbering
* Adjustable line spacing
* Print a selection of code with line numbers matching the editor
* Specify a browser other than your default (Edge won't automatically close after printing)

## Requirements

You'll need access to a printer.

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

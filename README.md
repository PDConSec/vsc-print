> Could I have some feedback please? I find it hard to believe this software is perfect. And if it _is_ perfect please say so in a review so I can feel smug about it.

# Visual Studio Code Printing

Code listings are iconic in a sense older than graphical user interfaces. Say no to millennial nonsense and print your code on paper with line numbers. Yes, I know it really should be faded dot-matrix on blue-lined 15" fanfold paper, but what can you do.

![Toolbar snap with print icon](https://user-images.githubusercontent.com/5498936/53408273-d853d480-3a09-11e9-8936-d37189dce8c5.PNG)

The print icon on the toolbar prints the document in the active editor.

If you have a text selection that crosses at least one line-break you can right click and choose Print from the context menu to send just the selection to the printer. In the absence of a multi-line selection the entire document is printed.

![context-menu-editor](https://user-images.githubusercontent.com/5498936/53408378-05a08280-3a0a-11e9-8e88-0088089e0d07.png)

Or you can right-click on a file in the file explorer pane and choose Print from the context menu.

![context-menu-file-explorer](https://user-images.githubusercontent.com/5498936/53408376-05a08280-3a0a-11e9-9912-31e869db64d5.png)

## Features

Printing on Mac, Linux and Windows
* Entirely local in operation, is not dependent on cloud services 
* Syntax colouring in a selection of named colour schemes
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
* `print.fontSize`: the font size 
* `print.lineNumbers`: on, off or inherit (do same as editor)
* `print.lineSpacing`: single, line-and-a-half or double spaced

## Known Issues

The list of stylesheets had to be severely shortened to work around a problem with large lists in VS Code. When handling of large lists is improved the full list of 90 stylesheets will be restored.

Chrome has a tendency to remember too much about printers, paper sizes and margins especially if you abort. If you try another browser and a problem goes away, it's Chrome helping too much and the solution is to load a web page, change your settings and print something, then exit clean. 

## Release Notes

Problems are fewer and further between so the rate of change is dropping. If you notice glitches please don't hesitate to log an issue. Printing is something that should just work.

### 0.4.0

Fix page-breaking by dropping @page margins and delegating margin control to the browser. 
Port allocation is now dynamic.

# Troubleshooting

## Prerequisites

* Start by making sure you can print a web page from your browser.
* Firefox is _not_ an ideal choice but if you prefer it as your default browser then you will be pleased to learn that you can you can configure printing to use a non-default browser &mdash; you can have it both ways.
* The user as which VS Code runs must be able to establish a listening socket.

## First launch hassles
* Nothing seems to happen &mdash; restart VS Code.
* Browser launches but no page loads &mdash; check networking permissions.
* Browser shows an error message about not finding a CSS file &mdash; you installed from a VSIX that wasn't prepared by us. Get the [official package](https://marketplace.visualstudio.com/items?itemName=pdconsec.vscode-print) and try again.

If something else is wrong, or you have an improvement idea, we invite you to log an issue on the GitHub repository.

## Choice of browser

The browser used will affect your experience.  

### Recommended for printing

For best printing results, install a Chromium based browser. If you don't want to make this your default browser, take advantage of the alternate-browser settings. 

The following are known to work well.
* Brave
* Chromium
* Chrome
* Edge

### NOT recommended for printing

* Firefox prints well enough but doesn't close the browser afterward. 
* Edge Classic is no longer supported.
* Internet Explorer is not supported.

## Markdown extensions and remoting

To use Print with a remote host, you must install it **on the remote host**. 

To get the benefit of a Markdown extension when printing a document from a remote host, the Markdown extension must be built with an `extensionKind` of `workspace` _and_ it must be installed to the remote host. 

Most such extensions are not built for `workspace`. They can be trivially fixed by modifying their `package.json`. Unfortunately this manual patch is likely to be lost whenever the extension is updated, so you should raise an issue with the author of extensions you patch.

## Alternate browser

You cannot supply command-line options on the alternate browser path. On Windows, we automatically put quotes around your path in case of spaces in file or folder names. On other platforms, spaces are automatically escaped.

Both auto-quoting and escaping of spaces are incompatible with the use of command line options. The solution is to create a batch file (or shell script) that launches the browser with command line options, and supply the path to the batch file (or shell script).

### Chrome and plugins
Chrome may retain your printer, paper size and margin selections between print jobs. Some Chrome command line options cause errors to be reported, even though printing succeeds. 

Some Chrome plugins interfere with print job styling. While it is possible to suppress plugins with `--disable-plugins` this doesn't work when there is already a running instance of Chrome. The `--incognito` switch suppresses plugins when there is a running instance, but has its own problems.

## Indirect Internet dependencies

The Math+Markdown extension (installs the KaTeX plugin) requires an internet connection for stylesheets and fonts. You must also configure a stylesheet reference. Details are in the manual.

## Reporting a problem

If you _still_ can't get Print to work, [raise an issue on the repository](https://github.com/PDConSec/vsc-print/issues). We'll try to help you.



We may ask you to crank up your logging level, reproduce the problem and then send us the log.

### Logging

Set the logging level with the `Print: Log Level` setting. This defaults to `error` (minimal logging) but you can turn it all the way up to `debug` which is very detailed, or even `silly` which will even log calls to the garbage collector.


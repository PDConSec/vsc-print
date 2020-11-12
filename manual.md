# Visual Studio Code Printing

[English version](https://github.com/PeterWone/vsc-print) by Peter Wone

[ENGLISH](manual.md) | [FRENCH](manual.fra.md) | [РУССКИЕ](manual.rus.md) | [Add a language](how-to-add-a-language.md)

## Printing

### Print the active document

To print the active document just click the printer icon to the right of the document tabs.

### Print a selection in the active document

Select at least one line in the active document. Then either click the printer icon to the right of the document tabs or right-click on the selection and choose `Print` from the context menu. When the context menu appears, `Print` appears at (or near) the top, the bottom or nowhere depending on the setting `Print: Editor Context Menu Item Position` .

Line numbers in your printout are aligned with the line numbers in the editor whether these are visible or not. So if you are discussing a line of code numbered 1145 in a code review and you open the file to amend it, typing `Ctrl+G` and then 1145 `[Enter]` will put your cursor directly on the line of code in question.

### Print a file without opening it

To print a file other than the active document, find it in the EXPLORER pane and right-click on it. In the file context menu `Print` always appears at or near the top of the menu. This prints the entire file.

## Settings

This extension has the following settings, which can be modified by going to Code > Preferences > Settings > Extensions > Printing:

* `print.alternateBrowser` : enable/disable an alternate browser
* `print.announcePortAcquisition` : make the embedded web server tell you what port it uses
* `print.browserPath` : the path to a web browser
* `print.colourScheme` : the stylesheet used for colouring syntax
* `print.editorContextMenuItemPosition` : the position of `Print` in the editor context menu
* `print.editorTitleMenuButton` : show print button in the editor title menu
* `print.fontSize` : the font size (options from 6 to 13 pt)
* `print.formatMarkdown` : render markdown as styled HTML when printing
* `print.lineNumbers` : on, off or inherit (do same as editor)
* `print.lineSpacing` : single, line-and-a-half or double spaced

### Choosing the font face

While font _size_ is controlled by the settings, font _face_ is determined by your editor settings. If you see Fira Code on screen, that's what will be printed. 

#### If you want a font size other than the sizes listed in the picker
1. Change the size using the picker to conveniently create an entry in the settings.
2. Edit the settings as JSON and type some other size, taking care not to mess up the units.

## Markdown

You probably want Markdown print-jobs rendered and styled, and this is the default behaviour. If, for your own ineffable reasons, you wish to print the raw text, you can un-check the setting `Print: Render Markdown` .

## Ports used by the embedded webserver

The browser gets content from an embedded webserver. As of 0.7.23 the port used by the embedded webserver is selected by the host operating system. A port selection range is no longer required or supported.

## Alternate browser

You can print with a browser other than your default browser.

Why would you want to do that?

* Chromium, Edge Dev and Chrome are the only browsers that close properly after printing. This makes them the best choices for printing, but you may have a different preference for daily web use.
* This can be handy for troubleshooting. Perhaps you are crafting your own stylesheet and want to be able to stop the browser from closing after printing so you can inspect on-screen.
* Some other reason of your own that I can't imagine.

To set up an alternate browser you must do two things:

1. Supply the path to the browser executable in the `Print: Browser Path` setting. On Windows it might be something like `C:\Program Files (x86)\Google\Chrome\Application\Chrome.exe`
1. Enable/disable the alternate browser using the setting `Print: Alternate Browser`

## Choose a colour scheme

The colours used for syntax highlighting can be styled by supplying a CSS stylesheet. Press `F1` and type `browse stylesheet` to find the command for setting this. Invoking it will open a file browse dialog that defaults to the folder containing VS Code Printing's cache of stylesheets. If you browse to somewhere else and choose a CSS file, it will be imported to the cache folder (potentially overwriting a file of the same name).

 The setting points at the the cached copy, so if you make changes you must repeat the import process.

## Katex markdown extension
This depends on CSS and fonts from the web. To get printing to work you must add the required stylesheet to your settings.

		"markdown.styles": [
			"https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.css"
		]

Here are some samples to help you check your configuration.
```
$$
\begin{alignedat}{2}
   10&x+ &3&y = 2 \\
   3&x+&13&y = 4
\end{alignedat}
$$
and thus

$$
x = \begin{cases}
   a &\text{if } b \\
   c &\text{if } d
\end{cases}
$$
```

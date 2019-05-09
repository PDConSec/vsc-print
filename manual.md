# Visual Studio Code Printing

## Printing
### The active document
To print the active document just click the printer icon to the right of the document tabs.

### A selection in the active document
Select at least one line in the active document. Then either click the printer icon to the right of the document tabs or right-click on the selection and choose `Print` from the context menu. When the context menu appears, `Print` appears at (or near) the top, the bottom or nowhere depending on the setting `Print: Editor Context Menu Item Position`.

Line numbers in your printout are aligned with the line numbers in the editor whether these are visible or not. So if you are discussing a line of code numbered 1145 in a code review and you open the file to amend it, typing `Ctrl+G` and then 1145`[Enter]` will put your cursor directly on the line of code in question.

### A file (without opening it)
To print a file other than the active document, find it in the EXPLORER pane and right-click on it. In the file context menu `Print` always appears at or near the top of the menu. This prints the entire file.

## Markdown
You probably want Markdown print-jobs rendered and styled, and this is the default behaviour. If, for your own ineffable reasons, you wish to print the raw text, you can un-check the setting `Print: Render Markdown`.

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

 ## Choose a font size
 Font _face_ is determined by your editor settings but font _size_ is independently controlled by the setting `Print Font Size` which gives you options from 9pt to 13pt. You can use any unit you like so long as it's points.
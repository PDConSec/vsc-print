# Change Log
All notable changes to the "VSCODE-PRINT" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## 0.5.3
Tab size respects editor setting.

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
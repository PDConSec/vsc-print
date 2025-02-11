import { logger } from './logger';
import { existsSync, accessSync, constants, statSync } from 'fs';
import * as vscode from 'vscode';

export type BrowserEntry = {
  name: string;
  path: string;
  downloadUrl: string;
};

export default class Browsers {
  static platformPaths: { [platform: string]: BrowserEntry[] } = {
    win32: [
      {
        name: "Google Chrome",
        path: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        downloadUrl: "https://www.google.com/chrome/"
      },
      {
        name: "Google Chrome (x86)",
        path: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        downloadUrl: "https://www.google.com/chrome/"
      },
      {
        name: "Mozilla Firefox",
        path: "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
        downloadUrl: "https://www.mozilla.org/firefox/"
      },
      {
        name: "Mozilla Firefox (x86)",
        path: "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe",
        downloadUrl: "https://www.mozilla.org/firefox/"
      },
      {
        name: "Microsoft Edge",
        path: "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
        downloadUrl: "https://www.microsoft.com/edge"
      },
      {
        name: "Microsoft Edge (x86)",
        path: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        downloadUrl: "https://www.microsoft.com/edge"
      },
      {
        name: "Brave",
        path: "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
        downloadUrl: "https://brave.com/"
      },
      {
        name: "Chromium",
        path: "C:\\Program Files\\Chromium\\Application\\chromium.exe",
        downloadUrl: "https://www.chromium.org/getting-involved/download-chromium/"
      },
      {
        name: "Opera",
        path: "C:\\Users\\%USERNAME%\\AppData\\Local\\Programs\\Opera\\launcher.exe",
        downloadUrl: "https://www.opera.com/"
      },
      {
        name: "Opera via Microsoft Store",
        path: "C:\\Users\\%USERNAME%\\AppData\\Local\\Programs\\Opera\\opera.exe",
        downloadUrl: "https://www.opera.com/"
      },
      {
        name: "Opera GX",
        path: "C:\\Users\\%USERNAME%\\AppData\\Local\\Programs\\Opera GX\\launcher.exe",
        downloadUrl: "https://www.opera.com/gx"
      },
      {
        name: "Vivaldi",
        path: "C:\\Users\\%USERNAME%\\AppData\\Local\\Vivaldi\\Application\\vivaldi.exe",
        downloadUrl: "https://vivaldi.com/"
      }
    ],
    darwin: [
      {
        name: "Google Chrome",
        path: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        downloadUrl: "https://www.google.com/chrome/"
      },
      {
        name: "Google Chrome Canary",
        path: "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
        downloadUrl: "https://www.google.com/chrome/canary/"
      },
      {
        name: "Mozilla Firefox",
        path: "/Applications/Firefox.app/Contents/MacOS/firefox",
        downloadUrl: "https://www.mozilla.org/firefox/"
      },
      {
        name: "Firefox Developer Edition",
        path: "/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox",
        downloadUrl: "https://www.mozilla.org/firefox/developer/"
      },
      {
        name: "Firefox Nightly",
        path: "/Applications/Firefox Nightly.app/Contents/MacOS/firefox",
        downloadUrl: "https://www.mozilla.org/firefox/nightly/"
      },
      {
        name: "Microsoft Edge",
        path: "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
        downloadUrl: "https://www.microsoft.com/edge"
      },
      {
        name: "Brave",
        path: "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
        downloadUrl: "https://brave.com/"
      },
      {
        name: "Chromium",
        path: "/Applications/Chromium.app/Contents/MacOS/Chromium",
        downloadUrl: "https://www.chromium.org/getting-involved/download-chromium/"
      },
      {
        name: "Opera",
        path: "/Applications/Opera.app/Contents/MacOS/Opera",
        downloadUrl: "https://www.opera.com/"
      },
      {
        name: "Opera GX",
        path: "/Applications/Opera GX.app/Contents/MacOS/Opera GX",
        downloadUrl: "https://www.opera.com/gx"
      },
      {
        name: "Vivaldi",
        path: "/Applications/Vivaldi.app/Contents/MacOS/Vivaldi",
        downloadUrl: "https://vivaldi.com/"
      }
    ],
    linux: [
      {
        name: "Google Chrome",
        path: "/usr/bin/google-chrome",
        downloadUrl: "https://www.google.com/chrome/"
      },
      {
        name: "Google Chrome Stable",
        path: "/usr/bin/google-chrome-stable",
        downloadUrl: "https://www.google.com/chrome/"
      },
      {
        name: "Mozilla Firefox",
        path: "/usr/bin/firefox",
        downloadUrl: "https://www.mozilla.org/firefox/"
      },
      {
        name: "Brave",
        path: "/usr/bin/brave-browser",
        downloadUrl: "https://brave.com/"
      },
      {
        name: "Chromium",
        path: "/usr/bin/chromium-browser",
        downloadUrl: "https://www.chromium.org/getting-involved/download-chromium/"
      },
      {
        name: "Opera",
        path: "/usr/bin/opera",
        downloadUrl: "https://www.opera.com/"
      },
      {
        name: "Vivaldi",
        path: "/usr/bin/vivaldi",
        downloadUrl: "https://vivaldi.com/"
      }
    ]
  };

  static possible = Browsers.platformPaths[process.platform] ?? [];

  static available(): BrowserEntry[] {
    const possibleBrowsers = Browsers.possible.map(browser => {
      browser.path = browser.path.replace('%USERNAME%', process.env.USERNAME ?? '');
      return browser;
    });
    return possibleBrowsers.filter(browser => existsSync(browser.path));
  }

  static async promptUserChoice(): Promise<BrowserEntry | null> {
    const availableBrowsers = Browsers.available();
    if (availableBrowsers.length === 0) {
      vscode.window.showInformationMessage('No browsers were detected on standard paths. If you need to install a browser, we recommend Chromium (not Chrome).');
      return null;
    }

    const browserNames = availableBrowsers.map(browser => browser.name).sort();
    const selectedBrowserName = await vscode.window.showQuickPick(browserNames, {
      placeHolder: 'Select a browser'
    });

    return availableBrowsers.find(browser => browser.name === selectedBrowserName) || null;
  }

  static resolveBrowserPath(browser: string): string | undefined {
    const browserEntry = Browsers.available().find(b => b.name === browser);
    if (browserEntry) {
      return browserEntry.path;
    } else {
      // check whether the string is a path to a file that is executable
      if (existsSync(browser)) {
        const stats = statSync(browser);
        if (stats.isDirectory()) {
          logger.error(`The path "${browser}" is a directory, not an executable file.`);
          return undefined;
        }
        if (process.platform === 'win32') {
          if (browser.endsWith('.exe')) {
            return browser;
          } else {
            logger.error(`The file at path "${browser}" is not an executable (.exe) file.`);
            return undefined;
          }
        } else {
          try {
            accessSync(browser, constants.X_OK);
            return browser;
          } catch {
            logger.error(`The file at path "${browser}" is not executable.`);
            return undefined;
          }
        }
      } else {
        logger.error(`The file at path "${browser}" does not exist.`);
        return undefined;
      }
    }
  }
}

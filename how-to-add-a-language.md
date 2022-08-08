# How to add a language

[English version](https://github.com/PeterWone/vsc-print) by Peter Wone

1. Open [the vscode-print repo](https://github.com/PeterWone/vsc-print).
1. Log in to GitHub.
1. Fork the repo and clone your fork to your workstation.
1. In the root of the repo there is a folder `i18n`. It contains one child folder for each supported language. The naming scheme is ISO639-3 and this is not negotiable. [Look up the three letter code for your language using this website.](https://iso639-3.sil.org/code_tables/639/data)
1. Create a folder with this name (`eng` for English, `fra` for French etc) as an immediate child of the `i18n` folder.
1. Copy the file `packagei18n.json` from the `/i18n/eng` folder to the folder you just created for your language.
1. Use a UTF8 capable editor (VS Code is a good choice) to edit this file.
1. Replace each English string with your translation.
   * Translation of jargon and technical terms is tricky but you are a subject matter expert, so ask yourself: If I were explaining or naming this in my own language, how would I phrase it? How would I write this in email to another programmer?
   * DO NOT translate the keys (the property names).
1. Edit the file `src/imports.ts` to register your translation for localisation of the UI.
   ```
   const locVal: any = {
     "de": require("../out/extension.nls.de.json"), 
     "en": require("../out/extension.nls.en.json"),
     "es": require("../out/extension.nls.es.json"),
     "fr": require("../out/extension.nls.fr.json"),
     "zh": require("../out/extension.nls.zh.json")
   };
   ```
1. Translate `README.md` and `manual.md` to `README.xyz.md` and `manual.xyz.md` where xyz is your language code.
1. There's probably no point translating _this_ file unless you seriously expect translation from your language to another.
1. Save, stage, commit and push your changes to your fork on GitHub.
1. Raise a PR to tell me to merge your updates into the next release.
1. Register your language in `gulpfile.js` so it will be built

I encourage you to credit yourself for translation in a by-line at the start of each document under the main heading. It is possible to make your name a mail link but there is no need since people can use your fork to raise issues.
@echo "You must define AZURE_TRANSLATOR_KEY and AZURE_TRANSLATOR_REGION environment variables to use this command"

call npx @vscode/l10n-dev export --outDir ./l10n ./src 
call npx @vscode/l10n-dev generate-azure -o ./l10n/ ./l10n/bundle.l10n.json ./package.nls.json -l zh-Hans ja es ru pt fr ko zh-Hant it pl hu cs bg tr my ca lt hy
echo BLORT
call node localise-walkthrough-media
const fs = require('fs');
const path = require('path');

const workspaceDir = __dirname;
const nlsFilesPattern = /^package\.nls\.([^\.]+)\.json$/;
const baseNlsFile = path.join(workspaceDir, 'package.nls.json');

console.log('Updating walkthrough media URLs...');
console.log('Workspace directory:', workspaceDir);
console.log('Base NLS file:', baseNlsFile);

fs.readFile(baseNlsFile, 'utf8', (err, baseData) => {
  if (err) {
    console.error(`Error reading base NLS file ${baseNlsFile}:`, err);
    return;
  }

  let baseJson;
  try {
    baseJson = JSON.parse(baseData);
    for (const key in baseJson) {
      if (!(key.startsWith('walkthroughs.') && key.endsWith('.media'))) {
        delete baseJson[key];
      }
    }
    console.log('walkthrough media:', baseJson);
  } catch (err) {
    console.error(`Error parsing JSON from base NLS file ${baseNlsFile}:`, err);
    return;
  }

  fs.readdir(workspaceDir, (err, files) => {
    if (err) {
      console.error('Error reading workspace directory:', err);
      return;
    }

    for (const file of files) {
      const match = file.match(nlsFilesPattern);
      if (match) {
        const locale = match[1];
        const filePath = path.join(workspaceDir, file);
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
          }

          let json;
          try {
            json = JSON.parse(data);
          } catch (err) {
            console.error(`Error parsing JSON from file ${filePath}:`, err);
            return;
          }

          let updated = false;
          for (const key in baseJson) {
            json[key] = baseJson[key].replace('{locale}', locale);
            console.log(json[key]);
            updated = true;
          }

          if (updated) {
          fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf8', err => {
            if (err) {
              console.error(`Error writing file ${filePath}:`, err);
            }
          });
        }
      });
}
    }
  });
});

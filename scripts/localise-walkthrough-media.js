const fs = require('fs');
const path = require('path');

const workspaceDir = __dirname;
const nlsFilesPattern = /^package\.nls\.(\w{2})\.json$/;
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
  } catch (err) {
    console.error(`Error parsing JSON from base NLS file ${baseNlsFile}:`, err);
    return;
  }

  // Remove keys that don't start with "walkthrough." and end with ".media"
  for (const key in baseJson) {
    if (!(key.startsWith('walkthrough.') && key.endsWith('.media'))) {
      delete baseJson[key];
    }
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
        console.log('Processing file:', filePath);
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
          for (const key in json) {
            if (key.startsWith('walkthrough.') && key.endsWith('.media')) {
              if (baseJson[key]) {
                json[key] = baseJson[key].replace('{locale}', locale);
                console.log(`Updated key ${key} in file ${filePath} to ${json[key]}`);
                updated = true;
              }
            }
          }

          if (updated) {
            fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf8', err => {
              if (err) {
                console.error(`Error writing file ${filePath}:`, err);
              } else {
                console.log(`Updated file ${filePath}`);
              }
            });
          }
        });
      }
    }
  });
});

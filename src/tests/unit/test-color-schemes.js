const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Color Scheme Mappings...\n');

// Load the imports directly from the source file
const importsPath = path.join(__dirname, 'src', 'imports.ts');
const importsContent = fs.readFileSync(importsPath, 'utf8');

// Extract filenameByCaption mapping using regex
const filenameMatch = importsContent.match(/export const filenameByCaption[^{]*{([^}]+)}/s);
if (!filenameMatch) {
  console.error('❌ Could not extract filenameByCaption mapping');
  process.exit(1);
}

// Parse the mapping entries
const mappingText = filenameMatch[1];
const mappingEntries = [];
const lines = mappingText.split('\n');
for (const line of lines) {
  const match = line.match(/^\s*"([^"]+)":\s*"([^"]+)"/);
  if (match) {
    mappingEntries.push([match[1], match[2]]);
  }
}

console.log(`📊 Found ${mappingEntries.length} color scheme mappings to test\n`);

const failures = [];
let tested = 0;

for (const [caption, filename] of mappingEntries) {
  tested++;
  try {
    // Try to require the CSS file
    const cssContent = require(`highlight.js/styles/${filename}.css`);
    
    if (!cssContent || !cssContent.default) {
      failures.push(`${caption} (${filename}): CSS file exists but has no default export`);
    } else {
      const cssString = cssContent.default.toString();
      if (!cssString || cssString.length === 0) {
        failures.push(`${caption} (${filename}): CSS content is empty`);
      } else if (!cssString.includes('.hljs')) {
        failures.push(`${caption} (${filename}): CSS doesn't appear to be highlight.js CSS (no .hljs class found)`);
      } else {
        console.log(`✅ ${caption} (${filename})`);
      }
    }
  } catch (error) {
    failures.push(`${caption} (${filename}): ${error.message}`);
  }
}

console.log(`\n📈 Summary: ${tested} tested, ${tested - failures.length} passed, ${failures.length} failed\n`);

if (failures.length > 0) {
  console.log('❌ FAILURES:');
  failures.forEach(f => console.log(`   ${f}`));
  console.log('\n💡 These mappings in src/imports.ts need to be updated to match available CSS files.');
  process.exit(1);
} else {
  console.log('🎉 All color schemes validate successfully!');
}

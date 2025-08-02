const fs = require('fs');
const path = require('path');
const { filenameByCaption } = require('../../dist/imports.js');

console.log('🔍 Validating colour scheme file paths...\n');

const failures = [];
const highlightjsStylesPath = path.join(__dirname, '../../node_modules/highlight.js/styles');

// Check if styles directory exists
if (!fs.existsSync(highlightjsStylesPath)) {
    console.error(`❌ highlight.js styles directory not found at ${highlightjsStylesPath}`);
    process.exit(1);
}

// Test each colour scheme path
for (const [caption, filename] of Object.entries(filenameByCaption)) {
    const cssPath = path.join(highlightjsStylesPath, `${filename}.css`);
    
    if (fs.existsSync(cssPath)) {
        console.log(`✅ ${caption}: ${filename}.css`);
    } else {
        console.log(`❌ ${caption}: ${filename}.css NOT FOUND`);
        failures.push(`${caption}: ${filename}.css`);
    }
}

// Test default CSS
const defaultCssPath = path.join(highlightjsStylesPath, 'default.css');
if (fs.existsSync(defaultCssPath)) {
    console.log(`✅ Default CSS: default.css`);
} else {
    console.log(`❌ Default CSS: default.css NOT FOUND`);
    failures.push('default.css');
}

// Show available files for reference
console.log('\n📁 Available CSS files in highlight.js:');
const cssFiles = fs.readdirSync(highlightjsStylesPath)
    .filter(file => file.endsWith('.css'))
    .sort();

cssFiles.forEach(file => {
    console.log(`   ${file}`);
});

// Summary
console.log(`\n📊 Summary:`);
console.log(`   Total mappings: ${Object.keys(filenameByCaption).length}`);
console.log(`   Valid paths: ${Object.keys(filenameByCaption).length - failures.length}`);
console.log(`   Invalid paths: ${failures.length}`);

if (failures.length > 0) {
    console.log('\n❌ FAILURES:');
    failures.forEach(failure => console.log(`   - ${failure}`));
    console.log('\n💡 These mappings in imports.ts need to be updated.');
    process.exit(1);
} else {
    console.log('\n🎉 All colour scheme paths are valid!');
    process.exit(0);
}

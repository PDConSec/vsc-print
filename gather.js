const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

(async () => {
  console.log('🧹 Cleaning dist directory...');
  await fs.rm("dist", { recursive: true });
  await fs.mkdir("dist", { recursive: true });
  
  // Check for latest KaTeX version and update if needed
  console.log('🔍 Checking for latest KaTeX version...');
  const forceUpdate = process.argv.includes('--force-katex-update');
  
  try {
    const currentVersion = require('./node_modules/katex/package.json').version;
    const latestVersionOutput = execSync('npm view katex version', { encoding: 'utf-8' }).trim();
    
    console.log(`📦 Current KaTeX version: ${currentVersion}`);
    console.log(`📦 Latest KaTeX version: ${latestVersionOutput}`);
    
    if (currentVersion !== latestVersionOutput || forceUpdate) {
      if (forceUpdate) {
        console.log('🔄 Force updating KaTeX to latest version...');
      } else {
        console.log('🔄 Updating KaTeX to latest version...');
      }
      execSync('npm install katex@latest', { stdio: 'inherit' });
      
      // Also update the types
      try {
        execSync('npm install @types/katex@latest', { stdio: 'inherit' });
        console.log('✅ KaTeX and types updated successfully');
      } catch (typeError) {
        console.log('✅ KaTeX updated successfully (types update failed, but continuing)');
      }
    } else {
      console.log('✅ KaTeX is already at latest version');
    }
  } catch (error) {
    console.warn('⚠️ Could not check for KaTeX updates:', error.message);
    console.log('📦 Proceeding with current version...');
  }
  
  // Verify current KaTeX version after potential update
  const katexPackageJson = require('./node_modules/katex/package.json');
  console.log(`📦 Using KaTeX version: ${katexPackageJson.version}`);
  
  // Copy KaTeX resources with verification
  console.log('📋 Copying KaTeX fonts...');
  await fs.cp("node_modules/katex/dist/fonts", "dist/fonts", { recursive: true });
  
  console.log('🎨 Copying KaTeX CSS...');
  await fs.copyFile("node_modules/katex/dist/katex.css", "dist/katex.css");
  
  // Verify KaTeX CSS was copied and contains expected content
  const katexCss = await fs.readFile("dist/katex.css", "utf-8");
  if (!katexCss.includes('.katex')) {
    throw new Error('❌ KaTeX CSS appears to be invalid or incomplete');
  }
  console.log('✅ KaTeX CSS verified and copied successfully');
  
  // Copy other dependencies
  console.log('📦 Copying other dependencies...');
  await fs.copyFile("assets/favicon.ico", "dist/favicon.ico");
  await fs.copyFile("node_modules/smiles-drawer/dist/smiles-drawer.min.js", "dist/smiles-drawer.min.js");
  await fs.copyFile("node_modules/smiles-drawer/dist/smiles-drawer.min.js.map", "dist/smiles-drawer.min.js.map");
  await fs.copyFile("node_modules/smartquotes/dist/smartquotes.js", "dist/smartquotes.js");
  await fs.copyFile("node_modules/smartquotes/dist/smartquotes.js.map", "dist/smartquotes.js.map");
  
  console.log('🎉 Build preparation complete!');
})();


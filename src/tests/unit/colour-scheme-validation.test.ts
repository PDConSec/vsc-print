import * as assert from 'assert';
import { filenameByCaption, captionByFilename } from '../../imports';

suite('Colour Scheme Validation Tests', () => {
    test('All colour scheme paths should resolve to existing CSS files', () => {
        const failures: string[] = [];
        
        for (const [caption, filename] of Object.entries(filenameByCaption)) {
            try {
                // Try to require the CSS file - this will throw if it doesn't exist
                const cssContent = require(`highlight.js/styles/${filename}.css`);
                
                // Verify the CSS content exists and has expected structure
                if (!cssContent || !cssContent.default) {
                    failures.push(`${caption} (${filename}): CSS file exists but has no default export`);
                } else {
                    const cssString = cssContent.default.toString();
                    if (!cssString || cssString.length === 0) {
                        failures.push(`${caption} (${filename}): CSS content is empty`);
                    } else if (!cssString.includes('.hljs')) {
                        failures.push(`${caption} (${filename}): CSS doesn't appear to be highlight.js CSS (no .hljs class found)`);
                    }
                }
            } catch (error: any) {
                failures.push(`${caption} (${filename}): ${error.message}`);
            }
        }
        
        if (failures.length > 0) {
            const failureMessage = 'The following colour schemes failed validation:\n' + 
                failures.map(f => `  - ${f}`).join('\n') + 
                '\n\nThis indicates that the filenameByCaption mapping in imports.ts contains invalid paths.';
            console.log('\n' + failureMessage);
            assert.fail(failureMessage);
        }
    });

    test('Default CSS should be valid', () => {
        try {
            const defaultCss = require("highlight.js/styles/default.css");
            assert.ok(defaultCss, 'Default CSS should be loadable');
            assert.ok(defaultCss.default, 'Default CSS should have default export');
            
            const cssString = defaultCss.default.toString();
            assert.ok(cssString && cssString.length > 0, 'Default CSS content should not be empty');
            assert.ok(cssString.includes('.hljs'), 'Default CSS should contain highlight.js classes');
        } catch (error: any) {
            assert.fail(`Default CSS validation failed: ${error.message}`);
        }
    });

    test('Colour scheme mapping should be bidirectional', () => {
        const failures: string[] = [];
        
        // Check that every filename in filenameByCaption has a corresponding entry in captionByFilename
        for (const [caption, filename] of Object.entries(filenameByCaption)) {
            if (!captionByFilename[filename as string]) {
                failures.push(`Caption "${caption}" maps to filename "${filename}" but reverse mapping is missing`);
            } else if (captionByFilename[filename as string] !== caption) {
                failures.push(`Caption "${caption}" maps to filename "${filename}" but reverse mapping gives "${captionByFilename[filename as string]}"`);
            }
        }
        
        if (failures.length > 0) {
            const failureMessage = 'Bidirectional mapping validation failed:\n' + 
                failures.map(f => `  - ${f}`).join('\n');
            assert.fail(failureMessage);
        }
    });

    test('No duplicate filenames in mapping', () => {
        const filenames = Object.values(filenameByCaption);
        const uniqueFilenames = new Set(filenames);
        
        if (filenames.length !== uniqueFilenames.size) {
            const duplicates: string[] = [];
            const seen = new Set<string>();
            
            for (const filename of filenames) {
                if (seen.has(filename as string)) {
                    if (!duplicates.includes(filename as string)) {
                        duplicates.push(filename as string);
                    }
                } else {
                    seen.add(filename as string);
                }
            }
            
            assert.fail(`Duplicate filenames found in mapping: ${duplicates.join(', ')}`);
        }
    });

    test('No duplicate captions in mapping', () => {
        const captions = Object.keys(filenameByCaption);
        const uniqueCaptions = new Set(captions);
        
        if (captions.length !== uniqueCaptions.size) {
            const duplicates: string[] = [];
            const seen = new Set<string>();
            
            for (const caption of captions) {
                if (seen.has(caption)) {
                    if (!duplicates.includes(caption)) {
                        duplicates.push(caption);
                    }
                } else {
                    seen.add(caption);
                }
            }
            
            assert.fail(`Duplicate captions found in mapping: ${duplicates.join(', ')}`);
        }
    });
});

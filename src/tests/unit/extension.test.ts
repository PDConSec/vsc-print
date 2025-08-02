import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { processFencedBlocks } from '../../renderers/processMarkdown';
import { ResourceProxy } from '../../renderers/resource-proxy';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('SPOILER fenced block test', async () => {
		const markdownContent = `# Test

\`\`\`spoiler
show: Click to reveal
hide: This is hidden content
\`\`\`

\`\`\`SPOILER
SHOW: Case insensitive test
HIDE: This should also work
\`\`\`
`;

		const generatedResources = new Map<string, ResourceProxy>();
		const tokens = await processFencedBlocks({}, markdownContent, generatedResources, '/tmp');
		
		// Find the HTML tokens that were generated from the spoiler blocks
		const htmlTokens = tokens.filter(token => token.type === 'html');
		
		// Should have 2 HTML tokens (one for each spoiler block)
		assert.strictEqual(htmlTokens.length, 2);
		
		// Check that the first spoiler block was converted correctly
		const firstSpoiler = htmlTokens[0] as any;
		assert.ok(firstSpoiler.text.includes('<details class="spoiler">'));
		assert.ok(firstSpoiler.text.includes('Click to reveal'));
		assert.ok(firstSpoiler.text.includes('This is hidden content'));
		
		// Check that the second spoiler block (uppercase) was converted correctly
		const secondSpoiler = htmlTokens[1] as any;
		assert.ok(secondSpoiler.text.includes('<details class="spoiler">'));
		assert.ok(secondSpoiler.text.includes('Case insensitive test'));
		assert.ok(secondSpoiler.text.includes('This should also work'));
	});

	test('SPOILER error handling test', async () => {
		const markdownContent = `# Test

\`\`\`spoiler
show: Valid content
hide: Valid content
invalid: This should cause an error
\`\`\`
`;

		const generatedResources = new Map<string, ResourceProxy>();
		const tokens = await processFencedBlocks({}, markdownContent, generatedResources, '/tmp');
		
		// Find the code tokens that were generated (error cases return code tokens)
		const codeTokens = tokens.filter(token => token.type === 'code');
		
		// Should have 1 code token with error message
		assert.strictEqual(codeTokens.length, 1);
		
		const errorToken = codeTokens[0] as any;
		assert.ok(errorToken.text.includes('Invalid keys in SPOILER block'));
		assert.ok(errorToken.text.includes('invalid'));
	});
});

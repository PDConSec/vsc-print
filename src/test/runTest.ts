import * as path from 'path';
import * as fs from 'fs';

import { runTests } from '@vscode/test-electron';
import { TestOptions } from '@vscode/test-electron/out/runTest';

async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../../');

		// The path to the extension test runner script
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		const vsixName = fs.readdirSync(extensionDevelopmentPath)
			.filter(p => path.extname(p) === ".vsix" && p.includes("vscode-print-"))
			.sort((a, b) => a < b ? 1 : a > b ? -1 : 0)[0];

		let options: TestOptions = {
			extensionDevelopmentPath,
			extensionTestsPath,
			launchArgs: [
				path.resolve(__dirname, '../../src/test/test-docs'),
//				`--install-extension=${vsixName}`,
				"--install-extension=ms-vscode-remote.remote-ssh"
			]
		}

		// Download VS Code, unzip it and run the integration test
		await runTests(options);
	} catch (err) {
		console.error(err);
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();
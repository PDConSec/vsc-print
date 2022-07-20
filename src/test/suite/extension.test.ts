import { PrintSession } from '../../print-session';
import * as assert from 'assert';
import { after } from 'mocha';
import path = require('path');
import axios from 'axios';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

// NOTE we don't import and call directly, we expect the extension to be 
// installed and active, and we use registered commands to manipulate it.

suite('Print Extension Test Suite', () => {
	after(() => {
		vscode.window.showInformationMessage('All tests done!');
	});

	test(`Check platform browser launch command on ${process.platform}`, async () => {
		const printConfig = vscode.workspace.getConfiguration("print", null);
		await printConfig.update("alternateBrowser", false);
		const cmd = await vscode.commands.executeCommand<string>("extension.test.browserLaunchCommand");
		switch (process.platform) {

			case "win32":
				assert.strictEqual(cmd, "start");
				break;

			case "linux":
				assert.strictEqual(cmd, "xdg-open");
				break;

			case "darwin":
				assert.strictEqual(cmd, "open");
				break;
		}
	});

	test(`Check platform alternate browser launch command on ${process.platform}`, async () => {
		const printConfig = vscode.workspace.getConfiguration("print", null);
		await printConfig.update("alternateBrowser", true);
		let cmd: string | undefined;
		switch (process.platform) {
			case "win32":
				await printConfig.update("browserPath", "c:\\Program Files\\Google\\Chrome\\Application\\chrome.exe");
				cmd = await vscode.commands.executeCommand<string>("extension.test.browserLaunchCommand");
				assert.strictEqual(cmd, '"c:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"');
				break;

			case "linux":
			case "darwin":
				await printConfig.update("browserPath", "/path/with spaces/executable");
				cmd = await vscode.commands.executeCommand<string>("extension.test.browserLaunchCommand", true);
				assert.strictEqual(cmd, "/path/with\\ spaces/executable");
				break;
		}
	});

	test('Print active editor', async () => {
		const W = vscode.workspace.workspaceFolders;
		let w = W![0].uri.fsPath;
		const otd = await vscode.workspace.openTextDocument(path.join(w, "sample.json"));
		const flags = await vscode.commands.executeCommand<Set<string>>("extension.test.flags");
		flags?.add("suppress browser");
		await vscode.window.showTextDocument(otd);
		assert.ok(vscode.window.activeTextEditor);
		const session = (await vscode.commands.executeCommand<PrintSession>("extension.print"))!;
		await session.ready;
		const url = session.getUrl();
		let response = await axios.get(url);
		assert.equal(response.headers["content-type"], 'text/html; charset=utf-8');
		assert.ok(response.data.includes("<title>sample.json</title>"));
		assert.ok(!session.completed);
		await axios.get(`${url}completed`);
		assert.ok(session.completed);
	});

	test('Print folder', async () => {
		const W = vscode.workspace.workspaceFolders!;
		let w = W[0].uri.fsPath;
		const flags = (await vscode.commands.executeCommand<Set<string>>("extension.test.flags"))!;
		flags.add("suppress browser");
		const session = (await vscode.commands.executeCommand<PrintSession>("extension.printFolder", W![0].uri))!;
		await session.ready;
		const url = session.getUrl();
		let response = await axios.get(url);
		assert.equal(response.headers["content-type"], 'text/html; charset=utf-8');
		assert.ok(response.data.includes("<title>test-docs</title>"));
		assert.ok(!session.completed);
		await axios.get(`${url}completed`);
		assert.ok(session.completed);
	});

	test("Completed sessions are unavailable", async () => {
		const W = vscode.workspace.workspaceFolders;
		let w = W![0].uri.fsPath;
		const uri = vscode.Uri.file(path.join(w, "sample.json"));
		const flags = await vscode.commands.executeCommand<Set<string>>("extension.test.flags");
		flags?.add("suppress browser");
		let session = (await vscode.commands.executeCommand<PrintSession>("extension.print", uri))!;
		let url = session.getUrl();
		await axios.get(`${url}completed`);
		await vscode.commands.executeCommand("extension.gc");
		let failed: boolean = false;
		try {
			const response = await axios.get(`${url}`);
		} catch (err) {
			failed = true;
		}
		assert.ok(failed, "Attempting to connect to a closed session should fail");
	});

	test("Document relative resource", async () => {
		const W = vscode.workspace.workspaceFolders;
		let w = W![0].uri.fsPath;
		const uri = vscode.Uri.file(path.join(w, "subfolder", "sample.md"));
		const flags = await vscode.commands.executeCommand<Set<string>>("extension.test.flags");
		flags?.add("suppress browser");
		const session = (await vscode.commands.executeCommand<PrintSession>("extension.print", uri))!;
		await session.ready;
		const url = session.getUrl();
		const response = await axios.get(`${url}vscode-print-128.png`);
		assert.equal(response.status, 200);
		assert.equal(response.headers["content-type"], "image/png");
		await axios.get(`${url}completed`);
	});

	test("Workspace resource", async () => {
		const W = vscode.workspace.workspaceFolders;
		let w = W![0].uri.fsPath;
		const uri = vscode.Uri.file(path.join(w, "subfolder", "sample.md"));
		const flags = await vscode.commands.executeCommand<Set<string>>("extension.test.flags");
		flags?.add("suppress browser");
		const session = (await vscode.commands.executeCommand<PrintSession>("extension.print", uri))!;
		await session.ready;
		const url = session.getUrl();
		const response = await axios.get(`${url}workspace.resource/2158834-45134090-2560-1440.jpg`);
		assert.equal(response.status, 200);
		assert.equal(response.headers["content-type"], "image/jpg");
		await axios.get(`${url}completed`);
	});

	test("Bundled resource", async () => {
		const W = vscode.workspace.workspaceFolders;
		let w = W![0].uri.fsPath;
		const uri = vscode.Uri.file(path.join(w, "subfolder", "sample.md"));
		const flags = await vscode.commands.executeCommand<Set<string>>("extension.test.flags");
		flags?.add("suppress browser");
		const session = (await vscode.commands.executeCommand<PrintSession>("extension.print", uri))!;
		await session.ready;
		const url = session.getUrl();
		const response = await axios.get(`${url}vsc-print.resource/default-markdown.css`);
		assert.equal(response.status, 200);
		assert.equal(response.headers["content-type"], "text/css; charset=utf-8");
		await axios.get(`${url}completed`);
	});

	//todo do it all again with a remote workspace

});
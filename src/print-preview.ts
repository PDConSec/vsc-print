import * as vscode from 'vscode';

export class PrintPreview {
	public static readonly viewType = 'PrintPreview';

	private _panel: vscode.WebviewPanel;
	private _disposables: vscode.Disposable[] = [];
	private _html: string;

	private constructor(panel: vscode.WebviewPanel, html:string) {
		this._panel = panel;
		this._html = html;
		this._update();
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
		this._panel.onDidChangeViewState(
			e => {
				if (this._panel.visible) {
					this._update();
				}
			},
			null,
			this._disposables
		);
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'alert':
						vscode.window.showErrorMessage(message.text);
						return;
				}
			},
			null,
			this._disposables
		);

	}

	private _update() {
		const webview = this._panel.webview;
		this._panel.title = "Preview";
		this._panel.webview.html = this._html;
	}

	public dispose() {
		PrintPreview.currentPanel = undefined;
		this._panel.dispose();
		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	// instance management is via static methods on this class
	public static currentPanel: PrintPreview | undefined;
	public static show(html:string) {
		const column = vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.One;

		if (PrintPreview.currentPanel) {
			PrintPreview.currentPanel._panel.reveal(column);
		} else {
			const panel = vscode.window.createWebviewPanel(this.viewType, "Preview", column);
			PrintPreview.currentPanel = new PrintPreview(panel, html);
		}
	}
	public static revive(panel: vscode.WebviewPanel, html:string) {
		PrintPreview.currentPanel = new PrintPreview(panel, html);
	}
}
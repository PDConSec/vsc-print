import * as vscode from 'vscode';

export class SourceCode {
	static Markdown: any;
	constructor(
		public filename: string,
		public code: string,
		public language: string,
		public startLine: number = 1,
	) { }
	public asHtml(): string {
		const printConfig = vscode.workspace.getConfiguration("print", null);
		if (printConfig.renderMarkdown && this.language === "markdown") {
			return SourceCode.Markdown.render(this.code);
		} else {
			let renderedCode = "";
			try {
				renderedCode = hljs.highlight(this.language, this.code).value;
			}
			catch (err) {
				renderedCode = hljs.highlightAuto(this.code).value;
			}

			renderedCode = this.fixMultilineSpans(renderedCode);

			var addLineNumbers = printConfig.lineNumbers === "on" || (printConfig.lineNumbers === "inherit" && vscode.window.activeTextEditor && (vscode.window.activeTextEditor.options.lineNumbers || 0) > 0);
			if (addLineNumbers) {
				var startLine = selection && !(selection.isEmpty || selection.isSingleLine) ? selection.start.line + 1 : 1;
				renderedCode = renderedCode
					.split("\n")
					.map(line => line || "&nbsp;")
					.map((line, i) => `<tr><td class="line-number">${startLine + i}</td><td class="line-text">${line.replace(/([^ -]{40})/g, "$1<wbr>")}</td></tr>`)
					.join("\n")
					.replace("\n</td>", "</td>")
					;
			} else {
				renderedCode = renderedCode
					.split("\n")
					.map(line => line || "&nbsp;")
					.map((line, i) => `<tr><td class="line-text">${line.replace(/([^ -]{40})/g, "$1<wbr>")}</td></tr>`)
					.join("\n")
					.replace("\n</td>", "</td>")
					;
			}
		}
		return "";
	}
	fixMultilineSpans(text: string): string {
		let classes: string[] = [];

		// since this code runs on simple, well-behaved, escaped HTML, we can just
		// use regex matching for the span tags and classes

		// first capture group is if it's a closing tag, second is tag attributes
		const spanRegex = /<(\/?)span(.*?)>/g;
		// https://stackoverflow.com/questions/317053/regular-expression-for-extracting-tag-attributes
		// matches single html attribute, first capture group is attr name and second is value
		const tagAttrRegex = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/g;

		return text.split("\n").map(line => {
			const pre = classes.map(classVal => `<span class="${classVal}">`);

			let spanMatch;
			spanRegex.lastIndex = 0; // exec maintains state which we need to reset
			while ((spanMatch = spanRegex.exec(line)) !== null) {
				if (spanMatch[1] !== "") {
					classes.pop();
					continue;
				}
				let attrMatch;
				tagAttrRegex.lastIndex = 0;
				while ((attrMatch = tagAttrRegex.exec(spanMatch[2])) !== null) {
					if (attrMatch[1].toLowerCase().trim() === "class") {
						classes.push(attrMatch[2]);
					}
				}
			}

			return pre + line + "</span>".repeat(classes.length);
		}).join("\n");
	}
	Utf8ArrayToStr(array: Uint8Array): string {
		var out, i, len, c;
		var char2, char3;
		out = "";
		len = array.length;
		i = 0;
		while (i < len) {
			c = array[i++];
			switch (c >> 4) {
				case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
					// 0xxxxxxx
					out += String.fromCharCode(c);
					break;
				case 12: case 13:
					// 110x xxxx   10xx xxxx
					char2 = array[i++];
					out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
					break;
				case 14:
					// 1110 xxxx  10xx xxxx  10xx xxxx
					char2 = array[i++];
					char3 = array[i++];
					out += String.fromCharCode(((c & 0x0F) << 12) |
						((char2 & 0x3F) << 6) |
						((char3 & 0x3F) << 0));
					break;
			}
		}
		return out;
	}
}

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('vscode-lineend-straighten.straightenLineEnd', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const doc = editor.document;
			const sel = editor.selection;
			const text = doc.getText(sel);
			if (text) {
				const formatted = formatLineEnd(text);
				if (formatted) {
					editor.edit(editBuilder => {
						editBuilder.replace(sel, formatted);
					});
				} else {
					console.log("Text not formatted");
				}
			} else {
				console.log("No text is detected.");
			}
		}
	});

	context.subscriptions.push(disposable);
}

function formatLineEnd(text: string): string {
	//console.log('formatLineEnd');
	let formatted = '';

    const lines = text.split(/\n/);

	// 全体の中の最終位置を取得
	let lastPos = 0;
	lines.forEach(line => {
		if (lastPos < line.length) {
			lastPos = line.length;
		}
	});

	// 4の倍数にそろえる
	lastPos = Math.floor(lastPos / 4) * 4 + 4;
	//console.log(lastPos);

	// 行末をそろえる
	// すべての行は、lastPosより短いはず
	let eol = "\n";
	lines.forEach(line => {
		// 行末に\rがあったら、lineから\rを取り、改行コードを変更しておく
		if (line.slice(-1) === "\r") {
			eol = "\r\n";
			line = line.slice(0, line.length-1);
		}

		let tempLine = line + " ".repeat(lastPos - line.length) + eol;
		formatted += tempLine;
	});

	return formatted;
}

export function deactivate() {}

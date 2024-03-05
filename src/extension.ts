import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const output = vscode.window.createOutputChannel('smart-brackets');
	output.appendLine('Congratulations, your extension "smart-brackets" is now active!');

	const disposable = vscode.workspace.onDidChangeTextDocument(async e => {
		let doc = e.document;
		let editor = vscode.window.activeTextEditor;

		// it is the current document that changed
		if (editor?.document === doc) {

			// multiple changes, we can't handle this
			if (e.contentChanges.length > 1) {
				return;
			}

			// get the first change
			const change = e.contentChanges[0];
			const line = change.range.start.line;
			if (change.range.end.line !== line) {
				return;
			}

			const change_text = change.text;

			if (change_text.trim() === '}') {

				if (editor) {
					const prev_selection = editor.selection;
					const end_of_closing_bracket = prev_selection.active.translate(0, 1);
					await vscode.commands.executeCommand('editor.action.jumpToBracket');

					let matching_paren = editor?.selection.active;

					if (editor) {
						editor.selection = new vscode.Selection(end_of_closing_bracket, end_of_closing_bracket);
					}

					if (matching_paren) {
						const res = await vscode.commands.executeCommand(
							'vscode.executeFormatRangeProvider',
							doc.uri,
							new vscode.Range(matching_paren, end_of_closing_bracket), {}
						);
						if (res) {
							const edits = res as vscode.TextEdit[];
							await editor?.edit(editBuilder => {
								edits.forEach(edit => {
									if (edit.range.start.line === end_of_closing_bracket.line) {
										return;
									}
									editBuilder.replace(edit.range, edit.newText);
								});
							});
						}
					}

				}

			}

		}
	});

	context.subscriptions.push(disposable);

}

// This method is called when your extension is deactivated
export function deactivate() { }

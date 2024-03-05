import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Test fix indent', async () => {
		// open new typescript file (built-in language support for testing purposes)
		const doc = await vscode.workspace.openTextDocument({ language: 'typescript', content: 'for (let i = 0; i < 10; i++) {\nconsole.log("Hello, World!");\n' });
		const editor = await vscode.window.showTextDocument(doc, vscode.ViewColumn.One);


		// move cursor to the end of the first line
		editor.selection = new vscode.Selection(new vscode.Position(1, 31), new vscode.Position(1, 31));

		// type '}' to trigger the extension
		await vscode.commands.executeCommand('type', { text: '\n' });
		await vscode.commands.executeCommand('type', { text: '}' });

		await new Promise(resolve => setTimeout(resolve, 500));

		// get the text of the document
		const text = doc.getText();
		// check if the text is formatted
		assert.strictEqual(text,
			`for (let i = 0; i < 10; i++) {
    console.log("Hello, World!");
}
`);
	});
});

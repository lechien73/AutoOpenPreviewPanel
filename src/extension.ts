
import * as vscode from 'vscode';
import { workspace, window, commands, ExtensionContext } from 'vscode';

export function activate(context: ExtensionContext) {

	let previewCommand: string;

	function refreshSettings() {
		let settings = workspace.getConfiguration('autoOpenPreviewPanel');
		let langs: any = settings.get('languages');
		let languages = langs.split(',');
		previewCommand = settings.get('openPreviewToSide') ? 'showPreviewToSide' : 'showPreview';
		return languages;
	}

	function refreshPreview() {

		let textEditor = window.activeTextEditor;
		if (textEditor) {
			let languages = refreshSettings();
			let doc = textEditor.document;
			if (doc && languages.includes(doc.languageId)) {
				openPreview(doc.languageId);
			}
		}
	}
	function openPreview(lang: string) {
		commands.executeCommand(`${lang}.${previewCommand}`)
			.then(() => { }, (e) => console.error(e));
	}

	if (window.activeTextEditor) {
		refreshPreview();
	} else {
		vscode.window.onDidChangeActiveTextEditor(() => {
			refreshPreview();
		});
	}

	vscode.workspace.onDidOpenTextDocument((doc) => {
		let languages = refreshSettings()
		if (doc && languages.includes(doc.languageId)) {
			openPreview(doc.languageId);
		}
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }

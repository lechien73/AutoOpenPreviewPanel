/**
 * Auto Open Preview Panel
 * VS Code Extension
 * Matt Rudge, July 2021
 */
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let previewCommand: string;
	let extensionEnabled: boolean;

	/**
	 * Refreshes the settings in case they've changed
	 * @returns languages: array
	 */
	function refreshSettings() {

		let settings = vscode.workspace.getConfiguration('autoOpenPreviewPanel');
		let langs: any = settings.get('languages');
		let languages = langs.split(',');
		extensionEnabled = settings.get('extensionEnabled') || true;
		previewCommand = settings.get('openPreviewToSide') ? 'showPreviewToSide' : 'showPreview';
		return languages;
	}

	/**
	 * Refreshes the preview panel when the editor changes
	 */
	function refreshPreview() {

		let textEditor = vscode.window.activeTextEditor;
		if (textEditor) {
			let languages = refreshSettings();
			let doc = textEditor.document;
			if (extensionEnabled && doc && languages.includes(doc.languageId)) {
				openPreview(doc.languageId);
			}
		}
	}

	/**
	 * Opens the preview panel using the language and current preview command
	 * @param lang a string containing the language ID
	 */
	function openPreview(lang: string) {
		vscode.commands.executeCommand(`${lang}.${previewCommand}`)
			.then(() => { }, (e) => console.error(e));
	}

	if (vscode.window.activeTextEditor) {
		refreshPreview();
	} else {
		vscode.window.onDidChangeActiveTextEditor(() => {
			refreshPreview();
		});
	}

	vscode.workspace.onDidOpenTextDocument((doc) => {
		let languages = refreshSettings();
		if (extensionEnabled && doc && languages.includes(doc.languageId)) {
			openPreview(doc.languageId);
		}
	});
}

export function deactivate() { }

/**
 * Auto Open Preview Panel
 * VS Code Extension
 * Matt Rudge, July 2021, updated March 2026
 */
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let previewCommand: string;
	let extensionEnabled: boolean;
	let didAlreadyOpen = false;

	/**
	 * Refreshes the settings in case they've changed
	 */
	function refreshSettings() {

		let settings = vscode.workspace.getConfiguration('autoOpenPreviewPanel');
		extensionEnabled = settings.get('extensionEnabled') || true;
		previewCommand = settings.get('openPreviewToSide') ? 'showPreviewToSide' : 'showPreview';
	}

	/**
	 * Refreshes the preview panel when the editor changes
	 */
	function refreshPreview() {

		let textEditor = vscode.window.activeTextEditor;
		if (textEditor && !didAlreadyOpen) {
			refreshSettings();
			let doc = textEditor.document;
			if (extensionEnabled && doc && doc.languageId === 'markdown') {
				openPreview(doc.languageId);
			}
			didAlreadyOpen = true;
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
		refreshSettings();
		const isVisible = vscode.window.visibleTextEditors.some(editor => editor.document === doc);
		if (extensionEnabled && doc && doc.languageId === 'markdown' && isVisible) {
			openPreview(doc.languageId);
		}
	});
}

export function deactivate() { }

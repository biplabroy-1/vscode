import * as vscode from 'vscode';

let terminal: vscode.Terminal | undefined;

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.runNodeScript', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const filePath = document.fileName;

            if (!terminal) {
                terminal = vscode.window.createTerminal(`Node.js`);
            }
            terminal.show();
            terminal.sendText(`node "${filePath}"`);
            vscode.window.showInformationMessage(`Node.js script started: "${filePath}"`);

            vscode.window.onDidCloseTerminal((closedTerminal) => {
                if (closedTerminal === terminal) {
                    terminal = undefined;
                }
            });
        } else {
            vscode.window.showErrorMessage('No active editor found');
        }
    });

    context.subscriptions.push(disposable);

    // Adding a status bar item as a button
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 200);
    statusBarItem.text = 'Run Node.js';
    statusBarItem.command = 'extension.runNodeScript';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
}

export function deactivate() {
    if (terminal) {
        terminal.dispose();
    }
}

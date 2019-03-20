// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "javadoc-generator" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	//testers
	const isDirectory = source => lstatSync(source).isDirectory()
	const getDirectories = source =>
	 readdirSync(source).map(name => join(source, name)).filter(isDirectory)
	context.subscriptions.push(vscode.commands.registerCommand('extension.generateDoc', function () {
		vscode.window.showInformationMessage('Generating Javadoc');
		let terminal = vscode.window.createTerminal("Generate Javadoc",);
		let location = process.env.JAVA_HOME.split("\\");
		location[1] = "\"" + location[1] + "\"";
		var filePath = vscode.workspace.rootPath;
		let dir = getDirectories(filePath + "\\src");
		console.log(dir);
		for (let i = 0; i < dir.length; i++) {
			dir[i] = dir[i].split("\\")[dir[i].split("\\").length-1]
		}
		terminal.sendText(location.join("\\") + "\\bin\\javadoc -d " + filePath + "\\javadoc -sourcepath " + filePath + "\\src -subpackages " + dir.join(", "));
		terminal.show();
	}));
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

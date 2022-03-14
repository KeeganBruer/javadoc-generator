// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "javadoc-generator" is now active!');
	const passGenerateCommandsToTerminal = (location, filePath)=>{
		let terminal = vscode.window.createTerminal("Generate Javadoc");
		let dir = getDirectories(filePath);
		for (let i = 0; i < dir.length; i++) {
			dir[i] = dir[i].split("\\")[dir[i].split("\\").length-1]
		}
		let exe_location = "javadoc.exe"
		let trimmed_loc = location.trim();
		let loc_array = trimmed_loc.split("");
		if (trimmed_loc.split("/")[trimmed_loc.split("/").length-1] != "bin") {
			exe_location = "bin/"+exe_location;
		}
		if (loc_array[loc_array.length-1] != "/") {
			exe_location = "/"+exe_location;
		}
		terminal.sendText("\""+location+exe_location+"\" -d \"" + filePath + "\\javadoc\" -sourcepath \"" + filePath + "\" -subpackages " + dir.join(", "));
		terminal.show();
	}
	const isDirectory = source => lstatSync(source).isDirectory();
	const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory);
	let disposable = vscode.commands.registerCommand('javadoc-generator.generateDoc', async function () {
		// The code you place here will be executed every time your command is executed
		vscode.window.showInformationMessage('Using JAVA_HOME to find java JDK');

		let location;// = process.env.JAVA_HOME;
		
		if (!location) {
			vscode.window.showInformationMessage("No JAVA_HOME was found in the path.")
			location = await vscode.window.showInputBox({
				prompt:"Enter Location of the JDK or leave blank to use the one packaged with this project."
			})
			
		}
		if (!location || location.toLowerCase().trim() == "") {
			location = __dirname + "/dependencies/jdk/bin";
		}
		var filePath = await vscode.window.showInputBox({
			prompt:"Enter the path to the folder you wish to compile the javadoc for. "+
			"The path can either be absolute or use a \'./\' to signify the root directory of the workspace"+
			"With the Java project folder open as the root directory in the workspace, "+
			"you may also leave this field blank to use the default directory: \'./src\'"
		})
		if (!filePath || filePath.trim() == "") {
			filePath = vscode.workspace.rootPath + "/src";
		} else if (filePath.indexOf("./") == 0) {
			filePath = filePath.replace("./", vscode.workspace.rootPath + "/")
		}
		console.log("FilePath " + filePath)
		passGenerateCommandsToTerminal(location, filePath)
		
		// Display a message box to the user
		vscode.window.showInformationMessage('Javadoc Generated Successfully');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

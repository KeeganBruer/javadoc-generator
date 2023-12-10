/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from 'vscode';
import {JDGConfig} from "./JDGConfig"
import {JavaSettings, execute} from "./JavaSettings"

export const ExtensionOutput = vscode.window.createOutputChannel("JDGenerator")

export async function activate({ subscriptions, extension }: vscode.ExtensionContext) {
		let settings = new JavaSettings()
		await settings.load()
		// register a command that opens a cowsay-document
		subscriptions.push(vscode.commands.registerCommand('jdg.config', async (uri:vscode.Uri) => {
			ExtensionOutput.appendLine("adding config file to" + uri.fsPath)
			let CONFIG = new JDGConfig(settings, uri.fsPath);
			await CONFIG.saveFile();
			await CONFIG.showToUser();
		}));
		
		// register a command that opens a cowsay-document
		subscriptions.push(vscode.commands.registerCommand('jdg.run', async () => {
			let config_file = vscode.window.activeTextEditor?.document.fileName
			if (config_file == undefined) return;
			let _CONFIG = await JDGConfig.load(settings, config_file)
			if (_CONFIG == undefined) return;
			let CONFIG = _CONFIG;
			await CONFIG.saveFile()
			vscode.window.showInformationMessage(`Generating Javadoc`)
			let results = await execute(CONFIG.toJDocCommand())
			CONFIG.results = {
				"stdout":results,

			}
			await CONFIG.saveFile()
		}));	
		vscode.workspace.onDidSaveTextDocument(async (document: vscode.TextDocument) => {
			if (document.fileName.includes(".jdgenerator")) {
				ExtensionOutput.appendLine(document.fileName + " saved.")
				let _CONFIG = await JDGConfig.load(settings, document.fileName)
				if (_CONFIG == undefined) return;
				let CONFIG = _CONFIG;
				await CONFIG.saveFile()
			}
		});	
}

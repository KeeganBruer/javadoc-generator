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
	/**
	 * JDG: Initialize Config file
	 * 
	 * This command is executed on a workspace folder, providing the directory's URI as a parameter
	 * This command then generates a new JDG config file in the form of 'config.jdgenerator'
	 */
	subscriptions.push(vscode.commands.registerCommand('jdg.config', async (uri:vscode.Uri) => {
		ExtensionOutput.appendLine("adding config file to" + uri.fsPath)
		let CONFIG = new JDGConfig(settings, uri.fsPath);
		await CONFIG.validate()
		await CONFIG.showToUser();
	}));
	
	/**
	 * JDG: Generate Javadoc
	 * 
	 * This command is executed on a 'config.jdgenerator' file.
	 * This command uses the config file to run the Javadoc.exe
	 */
	subscriptions.push(vscode.commands.registerCommand('jdg.run', async () => {
		let config_file = vscode.window.activeTextEditor?.document.fileName
		if (config_file == undefined) return;
		let _CONFIG = await JDGConfig.load(settings, config_file)
		if (_CONFIG == undefined) return;
		let CONFIG = _CONFIG;
		await CONFIG.runJavadoc();
	}));	
	/**
	 * On 'config.jdgenerator' Saved
	 * 
	 * Validate the config file
	 */
	vscode.workspace.onDidSaveTextDocument(async (document: vscode.TextDocument) => {
		if (!document.fileName.includes("config.jdgenerator")) return;

		ExtensionOutput.appendLine(document.fileName + " saved.")
		let _CONFIG = await JDGConfig.load(settings, document.fileName)
		if (_CONFIG == undefined) return;
		let CONFIG = _CONFIG;
		await CONFIG.validate()
	});	
}

/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from 'vscode';
import * as fs from "fs"
import path = require('path');
import {JDGConfig} from "./JDGConfig"
import {useShell, waitForCompletion} from "./ShellHelper"

let CONFIG = new JDGConfig();
export function activate({ subscriptions, extension }: vscode.ExtensionContext) {
	
	// register a command that opens a cowsay-document
	subscriptions.push(vscode.commands.registerCommand('jdg.config', async () => {
		CONFIG = new JDGConfig();
		await CONFIG.saveFile();
		await CONFIG.showToUser();
	}));
	
	// register a command that opens a cowsay-document
	subscriptions.push(vscode.commands.registerCommand('jdg.run', async () => {
		await CONFIG.load()
		CONFIG.clearErrors()
		await useShell(async (terminal)=>{
			terminal.sendText("echo 'Sent text immediately after creating'");
		})
		CONFIG.results = {
			"hello":"world"
		}
		CONFIG.saveFile()
	}));

	CONFIG.load().then(()=>CONFIG.saveFile()).then(()=>CONFIG.watchFile())
}

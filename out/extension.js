"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = exports.ExtensionOutput = void 0;
const vscode = require("vscode");
const JDGConfig_1 = require("./JDGConfig");
const JavaSettings_1 = require("./JavaSettings");
exports.ExtensionOutput = vscode.window.createOutputChannel("JDGenerator");
async function activate({ subscriptions, extension }) {
    let settings = new JavaSettings_1.JavaSettings();
    await settings.load();
    // register a command that opens a cowsay-document
    subscriptions.push(vscode.commands.registerCommand('jdg.config', async (uri) => {
        exports.ExtensionOutput.appendLine("adding config file to" + uri.fsPath);
        let CONFIG = new JDGConfig_1.JDGConfig(settings, uri.fsPath);
        await CONFIG.saveFile();
        await CONFIG.showToUser();
    }));
    // register a command that opens a cowsay-document
    subscriptions.push(vscode.commands.registerCommand('jdg.run', async () => {
        let config_file = vscode.window.activeTextEditor?.document.fileName;
        if (config_file == undefined)
            return;
        let _CONFIG = await JDGConfig_1.JDGConfig.load(settings, config_file);
        if (_CONFIG == undefined)
            return;
        let CONFIG = _CONFIG;
        await CONFIG.saveFile();
        vscode.window.showInformationMessage(`Generating Javadoc`);
        let results = await (0, JavaSettings_1.execute)(CONFIG.toJDocCommand());
        CONFIG.results = {
            "stdout": results,
        };
        await CONFIG.saveFile();
    }));
    vscode.workspace.onDidSaveTextDocument(async (document) => {
        if (document.fileName.includes(".jdgenerator")) {
            exports.ExtensionOutput.appendLine(document.fileName + " saved.");
            let _CONFIG = await JDGConfig_1.JDGConfig.load(settings, document.fileName);
            if (_CONFIG == undefined)
                return;
            let CONFIG = _CONFIG;
            await CONFIG.saveFile();
        }
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map
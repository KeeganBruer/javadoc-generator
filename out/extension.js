"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const JDGConfig_1 = require("./JDGConfig");
const ShellHelper_1 = require("./ShellHelper");
let CONFIG = new JDGConfig_1.JDGConfig();
function activate({ subscriptions, extension }) {
    // register a command that opens a cowsay-document
    subscriptions.push(vscode.commands.registerCommand('jdg.config', async () => {
        CONFIG = new JDGConfig_1.JDGConfig();
        await CONFIG.saveFile();
        await CONFIG.showToUser();
    }));
    // register a command that opens a cowsay-document
    subscriptions.push(vscode.commands.registerCommand('jdg.run', async () => {
        await CONFIG.load();
        CONFIG.clearErrors();
        await (0, ShellHelper_1.useShell)(async (terminal) => {
            terminal.sendText("echo 'Sent text immediately after creating'");
        });
        CONFIG.results = {
            "hello": "world"
        };
        CONFIG.saveFile();
    }));
    CONFIG.load().then(() => CONFIG.saveFile()).then(() => CONFIG.watchFile());
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map
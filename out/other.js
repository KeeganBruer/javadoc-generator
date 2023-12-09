"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectFolder = void 0;
const path = require("path");
const vscode = require("vscode");
const JDGConfig_1 = require("./JDGConfig");
function getProjectFolder() {
    let fPath = vscode.window.activeTextEditor?.document.uri.fsPath;
    if (fPath == undefined)
        fPath = vscode.workspace.workspaceFile?.fsPath;
    if (fPath != undefined)
        fPath = path.join(fPath, "../");
    if (fPath == undefined)
        fPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (fPath == undefined)
        return { project_folder: undefined, src_folder: undefined };
    let src_folder = undefined;
    if (fPath.includes("src")) {
        fPath = fPath.split("src")[0];
        src_folder = fPath + "src";
    }
    else {
        src_folder = path.join(fPath, "./src");
        if (src_folder != undefined) {
            let doesExist = (0, JDGConfig_1.doesPathExist)(src_folder);
            if (!doesExist)
                src_folder = undefined;
        }
    }
    return { project_folder: fPath, src_folder };
}
exports.getProjectFolder = getProjectFolder;
//# sourceMappingURL=other.js.map
import path = require('path');
import * as vscode from 'vscode';
import { doesPathExist } from './JDGConfig';

export function getProjectFolder() {
    let fPath = vscode.window.activeTextEditor?.document.uri.fsPath
    if (fPath == undefined) fPath = vscode.workspace.workspaceFile?.fsPath;
    if (fPath != undefined) fPath = path.join(fPath, "../")
    if (fPath == undefined) fPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

    if (fPath == undefined) return {project_folder:undefined, src_folder:undefined};
    let src_folder:string|undefined = undefined;
    if (fPath.includes("src")) {
        fPath = fPath.split("src")[0]
        src_folder = fPath+"src"
    } else {
        src_folder = path.join(fPath, "./src")
        if (src_folder != undefined) {
            let doesExist = doesPathExist(src_folder)
            if (!doesExist) src_folder = undefined
        }
    }
    return {project_folder:fPath, src_folder};
}
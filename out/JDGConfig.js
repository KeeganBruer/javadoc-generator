"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectFolder = exports.doesPathExist = exports.JDGConfig = void 0;
const path = require("path");
const fs = require("fs");
const vscode = require("vscode");
const extension_1 = require("./extension");
class JDGConfig {
    constructor(settings, project_uri) {
        this.settings = settings;
        this.file_seperator = this.settings.get("file.separator") || "\\";
        this.JAVA_HOME = this.settings.get("java.home");
        this.errors = [];
        this.save_in_progress = false;
        this.setProjectFolder(project_uri);
        this.JAVDOC = `${this.JAVA_HOME}${this.file_seperator}bin${this.file_seperator}javadoc.exe`;
    }
    setProjectFolder(project_folder) {
        this.project_folder = project_folder;
        this.dist_folder = `${this.project_folder}${this.file_seperator}javadoc`;
        if (this.project_folder == undefined)
            return;
        this.config_path = path.join(this.project_folder, "./config.jdgenerator");
    }
    async saveFile() {
        this.save_in_progress = true;
        if (this.config_path == undefined)
            return;
        fs.writeFileSync(this.config_path, this.toString(), 'utf8');
    }
    async showToUser() {
        if (this.config_path == undefined)
            return;
        const uri = vscode.Uri.file(this.config_path);
        let doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
        await vscode.window.showTextDocument(doc, { preview: false });
    }
    clearErrors() {
        this.errors = [];
    }
    validate() {
    }
    static async load(settings, config_path) {
        if (!doesPathExist(config_path))
            return;
        let content = fs.readFileSync(config_path, "utf-8");
        let config_string = content.split("==== CONFIGS ====")[1];
        config_string = config_string.split("====")[0];
        let lines = config_string.split("\n");
        let CONFIG = new JDGConfig(settings, "");
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            let config = line.split(":");
            let k = config[0];
            let v = config.slice(1).join(":").trim();
            if (k == undefined || v == undefined
                || k.trim() == "" || v.trim() == "")
                continue;
            if (k == "PROJECT FOLDER") {
                CONFIG.setProjectFolder(v);
                continue;
            }
            if (k == "JAVADOC OUT FOLDER") {
                CONFIG.dist_folder = v;
                continue;
            }
            if (k == "JAVDOC.exe") {
                CONFIG.JAVDOC = v;
                continue;
            }
        }
        return CONFIG;
    }
    watchFile() {
    }
    toString() {
        let str = "";
        str += (`==== CONFIGS ====
PROJECT FOLDER: ${this.project_folder ? this.project_folder : "UNDEFINED"}
JAVADOC OUT FOLDER: ${this.dist_folder ? this.dist_folder : "UNDEFINED"}
JAVDOC.exe: ${this.JAVDOC ? this.JAVDOC : "UNDEFINED"}


`);
        str += (`==== COMMAND ====
${this.toJDocCommand(true)}


`);
        if (this.errors.length > 0)
            str += (`==== ERRORS ====
\t${this.errors.join("\n\t")}


`);
        else if (this.results) {
            str += (`==== JAVADOC OUTPUT ====
${this.results.stdout}

`);
        }
        return str;
    }
    toJDocCommand(multiline) {
        let javadoc_executable = `"${this.JAVDOC}"` || `javadoc.exe`;
        let sourcepath = `-sourcepath "${this.project_folder}"`;
        let distpath = `-d "${this.dist_folder}"`;
        let files = fromDir(this.project_folder, ".java");
        if (multiline == true)
            return `${javadoc_executable} \n\t${sourcepath} \n\t${distpath} \n\t${files.join("\n\t")}`;
        return `${javadoc_executable} ${sourcepath} ${distpath} ${files.join(" ")}`;
    }
}
exports.JDGConfig = JDGConfig;
function fromDir(startPath, filter) {
    extension_1.ExtensionOutput.appendLine("searching: " + startPath + " for " + filter);
    if (startPath == undefined || !doesPathExist(startPath)) {
        extension_1.ExtensionOutput.appendLine("folder doesn't exists " + startPath);
        return [];
    }
    extension_1.ExtensionOutput.appendLine("folder exists " + startPath);
    var files = fs.readdirSync(startPath);
    let found = [];
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            found.push(...fromDir(filename, filter)); //recurse
        }
        else if (filename.endsWith(filter)) {
            found.push(filename);
        }
        ;
    }
    ;
    return found;
}
;
function doesPathExist(src_folder) {
    if (src_folder == undefined)
        return false;
    try {
        let stats = fs.statSync(src_folder);
        if (stats.isDirectory())
            return true;
        if (stats.isFile())
            return true;
    }
    catch (e) { }
    return false;
}
exports.doesPathExist = doesPathExist;
function getProjectFolder() {
    let fPath = vscode.window.activeTextEditor?.document.uri.fsPath;
    if (fPath == undefined)
        fPath = vscode.workspace.workspaceFile?.fsPath;
    if (fPath != undefined)
        fPath = path.join(fPath, "../");
    if (fPath == undefined)
        fPath = vscode.window.activeTextEditor?.document.fileName;
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
            let doesExist = doesPathExist(src_folder);
            if (!doesExist)
                src_folder = undefined;
        }
    }
    return { project_folder: fPath, src_folder };
}
exports.getProjectFolder = getProjectFolder;
//# sourceMappingURL=JDGConfig.js.map
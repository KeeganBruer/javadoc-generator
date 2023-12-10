import path = require("path");
import * as fs from "fs"
import * as vscode from 'vscode';
import { JavaSettings, execute } from "./JavaSettings";
import { settings } from "cluster";
import {ExtensionOutput} from "./extension"

export class JDGConfig {
    project_folder:string|undefined
    config_path:string|undefined
    dist_folder:string|undefined
    JAVA_HOME:string|undefined
    JAVDOC:string|undefined
    file_seperator:string
    results:{
        stdout:string
    } | undefined
    errors:any[]
    save_in_progress:boolean
    settings:JavaSettings
    constructor(settings:JavaSettings, project_uri:string) {
        this.settings = settings;
        this.file_seperator = this.settings.get("file.separator") || "\\"
        this.JAVA_HOME = this.settings.get("java.home")
        
        this.errors = []
        this.save_in_progress = false;
        this.JAVDOC = `${this.JAVA_HOME}${this.file_seperator}bin${this.file_seperator}javadoc.exe`
        this.setProjectFolder(project_uri);
    }
    setProjectFolder(project_folder:string) {
        this.project_folder = project_folder
        this.dist_folder = `${this.project_folder}${this.file_seperator}javadoc`

        if (this.project_folder == undefined) return;
        this.config_path = path.join(this.project_folder, "./config.jdgenerator");
    }

    async saveFile() {
        ExtensionOutput.appendLine("Saving Config File: "+this.config_path)
        this.save_in_progress = true;
        if (this.config_path == undefined) return;
        fs.writeFileSync(this.config_path, this.toString(), 'utf8');
    }
    async showToUser() {
        if (this.config_path == undefined) return;
        const uri = vscode.Uri.file(this.config_path);
		let doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
		await vscode.window.showTextDocument(doc, { preview:false });
    }
    clearErrors() {
        this.errors = []
    }
    async validate():Promise<boolean> {
        ExtensionOutput.appendLine("Validating Config File")
        if (!doesPathExist(this.project_folder)) {
            this.errors.push("Project path does not exist")
        }
        if (!doesPathExist(this.JAVDOC)) {
            this.errors.push("Cannot find the specified Javadoc.exe")
        }
        await this.saveFile()
        return this.errors.length == 0;
    }
    static async load(settings:JavaSettings, config_path:string) {
        if (!doesPathExist(config_path)) return  new JDGConfig(settings, "");
        try {

        } catch (e){}
        let content = fs.readFileSync(config_path, "utf-8")
        let config_string = content.split("==== CONFIGS ====")[1]
        config_string = config_string.split("====")[0];
        let lines = config_string.split("\n");
        let CONFIG = new JDGConfig(settings, "");

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            let config = line.split(":")
            let k = config[0];
            let v = config.slice(1).join(":").trim();
            if (
                k == undefined || v == undefined
                || k.trim() == "" || v.trim() == "") continue;
            if (k == "PROJECT FOLDER") {CONFIG.setProjectFolder(v); continue;}
            if (k == "JAVADOC OUT FOLDER") {CONFIG.dist_folder = v; continue;}
            if (k == "JAVDOC.exe") {CONFIG.JAVDOC = v; continue;}
        }
        CONFIG.config_path = config_path;
        return CONFIG;
        
    }
    toString() {
        let str ="";
        str += (
`==== CONFIGS ====
PROJECT FOLDER: ${this.project_folder ? this.project_folder : "UNDEFINED"}
JAVADOC OUT FOLDER: ${this.dist_folder ? this.dist_folder : "UNDEFINED"}
JAVDOC.exe: ${this.JAVDOC ? this.JAVDOC : "UNDEFINED"}


`
        )
        if (this.errors.length == 0) str += (
`==== COMMAND ====
${this.toJDocCommand(true)}


`
        )
        if (this.errors.length > 0) str += (
`==== ERRORS ====
\t${this.errors.join("\n\t")}


`
        )
        else if (this.results) { 
            str += (
`==== JAVADOC OUTPUT ====
${this.results.stdout}

`
            )
            
        }
        return str;
    }

    toJDocCommand(multiline?:boolean) {
        let javadoc_executable = `"${this.JAVDOC}"` || `javadoc.exe`
        let sourcepath = `-sourcepath "${this.project_folder}"`
        let distpath = `-d "${this.dist_folder}"`
        let files = fromDir(this.project_folder, ".java").map(file=>`"${file}"`);
        if (multiline == true)
            return `${javadoc_executable} \n\t${sourcepath} \n\t${distpath} \n\t${files.join("\n\t")}`
        return `${javadoc_executable} ${sourcepath} ${distpath} ${files.join(" ")}`
    }
    async runJavadoc() {
        if (!await this.validate()) {
            vscode.window.showErrorMessage(`JDG: Please fix errors with config file before running`)
            return;
        }
        vscode.window.showInformationMessage(`Generating Javadoc`)
        let results = await execute(this.toJDocCommand())
		this.results = {
            "stdout":results,
		}
        this.saveFile()
    }
}

function fromDir(startPath:string|undefined, filter:string):string[] {
    ExtensionOutput.appendLine("searching: " + startPath + " for "+filter)
    if (startPath == undefined || !doesPathExist(startPath)) {
        ExtensionOutput.appendLine("folder doesn't exists " + startPath)
        return [];
    }
    ExtensionOutput.appendLine("folder exists " + startPath)

    var files = fs.readdirSync(startPath);
    let found = [];
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            found.push(...fromDir(filename, filter)); //recurse
        } else if (filename.endsWith(filter)) {
            found.push(filename)
        };
    };
    return found;
};

export function doesPathExist(src_folder:string|undefined):src_folder is string {
    if (src_folder == undefined) return false;
    try {
        let stats = fs.statSync(src_folder);
        if (stats.isDirectory()) return true; 
        if (stats.isFile()) return true; 
    } catch (e){}
    return false;
}

export function getProjectFolder() {
    let fPath = vscode.window.activeTextEditor?.document.uri.fsPath
    if (fPath == undefined) fPath = vscode.workspace.workspaceFile?.fsPath;
    if (fPath != undefined) fPath = path.join(fPath, "../")
    if (fPath == undefined) fPath = vscode.window.activeTextEditor?.document.fileName;

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
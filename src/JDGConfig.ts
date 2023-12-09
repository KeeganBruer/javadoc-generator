import path = require("path");
import * as fs from "fs"
import * as vscode from 'vscode';
import {getProjectFolder} from "./other"

export class JDGConfig {
    project_folder:string|undefined
    config_path:string|undefined
    src_folder:string|undefined
    dist_folder:string|undefined
    JAVA_HOME:string|undefined
    results:any
    errors:any[]
    save_in_progress:boolean
    constructor() {
        this.errors = []
        this.save_in_progress = false;
        this.setProjectFolder(getProjectFolder());
    }
    setProjectFolder(props:{project_folder:string|undefined, src_folder:string|undefined}) {
        this.project_folder = props.project_folder
        this.src_folder = props.src_folder
        this.dist_folder = this.project_folder

        if (this.project_folder == undefined) return;
        this.config_path = path.join(this.project_folder, "./results.jdgenerator");
    }

    async saveFile() {
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
    validate() {

    }
    async load() {
        vscode.window.showInformationMessage(`Loading Config: ${this.config_path}`)
        if (!doesPathExist(this.config_path)) return;
        let content = fs.readFileSync(this.config_path, "utf-8")
        let config_string = content.split("==== CONFIGS ====")[1]
        config_string = config_string.split("====")[0];
        let lines = config_string.split("\n");
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            let config = line.split(":")
            let k = config[0];
            let v = config.slice(1).join(":").trim();
            if (
                k == undefined || v == undefined
                || k.trim() == "" || v.trim() == "") continue;
            if (k == "PROJECT FOLDER") {this.project_folder = v; continue;}
            if (k == "SOURCE FOLDER") {this.src_folder = v; continue;}
            if (k == "JAVADOC OUT FOLDER") {this.dist_folder = v; continue;}
            if (k == "JAVA_HOME") {this.JAVA_HOME = v; continue;}
        }
    }
    watchFile() {
        if (this.config_path == undefined) return;
        const watcher = vscode.workspace.createFileSystemWatcher(this.config_path);
        watcher.onDidChange((e) => {
            vscode.window.showInformationMessage("Change to JDG Config")
            if (this.save_in_progress == true) {
                this.save_in_progress = false;
                return;
            }
            this.clearErrors();
            this.load();
            this.saveFile()
        });
    }
    toString() {
        let str ="";
        str += (
`==== CONFIGS ====
PROJECT FOLDER: ${this.project_folder ? this.project_folder : "UNDEFINED"}
SOURCE FOLDER: ${this.src_folder ? this.src_folder : "UNDEFINED"}
JAVADOC OUT FOLDER: ${this.dist_folder ? this.dist_folder : "UNDEFINED"}
JAVA_HOME: ${this.JAVA_HOME ? this.JAVA_HOME : "UNDEFINED"}


`
        )
        str += (
`==== COMMAND ====
${this.toJDocCommand(true)}


`
        )
        if (this.errors.length > 0) str += (
`==== ERRORS ====
\t${this.errors.join("\n\t")}


`
        )
        else if (this.results) str += (
`==== RESULTS ====
${JSON.stringify(this.results, null, 4)}
`
        )
        return str;
    }

    toJDocCommand(multiline?:boolean) {
        let javadoc_executable = `javadoc.exe`
        let sourcepath = `-sourcepath "${this.src_folder}"`
        let distpath = `-d "${this.dist_folder}"`
        if (multiline == true)
            return `${javadoc_executable} \n\t${sourcepath} \n\t${distpath}`
        return `${javadoc_executable} ${sourcepath} ${distpath}`
    }
}


export function doesPathExist(src_folder:string|undefined):src_folder is string {
    if (src_folder == undefined) return false;
    let stats = fs.statSync(src_folder);
    if (stats.isDirectory()) return true; 
    if (stats.isFile()) return true; 
    return false;
}
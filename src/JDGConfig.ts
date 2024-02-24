import path = require("path");
import * as fs from "fs";
import * as vscode from "vscode";
import { JavaSettings, execute } from "./JavaSettings";
import { settings } from "cluster";
import {ExtensionOutput} from "./extension";
import { ExecFileException } from "child_process";

export class JDGConfig {
	project_folder:string|undefined;
	config_path:string|undefined;
	dist_folder:string|undefined;
	JAVA_HOME:string|undefined;
	JAVDOC:string|undefined;
	excluded_folders:string[]
	raw_params:string

	file_seperator:string;
	results:{
        stdout:string
    } | undefined;
	errors:any[];
	save_in_progress:boolean;
	settings:JavaSettings;
	constructor(settings:JavaSettings, project_uri:string) {
		this.settings = settings;
		this.file_seperator = this.settings.get("file.separator") || "\\";
		this.JAVA_HOME = this.settings.get("java.home");
        this.excluded_folders = [];
		this.errors = [];
		this.raw_params = ""
		this.save_in_progress = false;
		this.JAVDOC = `${this.JAVA_HOME}${this.file_seperator}bin${this.file_seperator}javadoc.exe`;
		if (!doesPathExist(this.JAVDOC)) {
			this.JAVDOC = `${this.JAVA_HOME}${this.file_seperator}bin${this.file_seperator}javadoc`;
			if (!doesPathExist(this.JAVDOC)) {
				this.errors.push("Could not find a valid javadoc executable located in: "+`\n\t${this.JAVA_HOME}${this.file_seperator}bin${this.file_seperator}`);
				this.JAVDOC = `${this.JAVA_HOME}${this.file_seperator}bin${this.file_seperator}`;
			}
		}
		this.setProjectFolder(project_uri);
	}
	setProjectFolder(project_folder:string) {
		this.project_folder = project_folder;
		this.dist_folder = `${this.project_folder}${this.file_seperator}javadoc`;

		if (this.project_folder == undefined) return;
		this.config_path = path.join(this.project_folder, "./config.jdgenerator");
	}

	async saveFile() {
		ExtensionOutput.appendLine("Saving Config File: "+this.config_path);
		this.save_in_progress = true;
		if (this.config_path == undefined) return;
		ExtensionOutput.appendLine("Written Config File");
		try {

			fs.writeFileSync(this.config_path, this.toString(), "utf8");
		} catch (e) {
			ExtensionOutput.appendLine(JSON.stringify(e));

		}
		ExtensionOutput.appendLine("Written Config File");
	}
	async showToUser() {
		if (this.config_path == undefined) return;
		const uri = vscode.Uri.file(this.config_path);
		const doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
		await vscode.window.showTextDocument(doc, { preview:false });
	}
	clearErrors() {
		this.errors = [];
	}
	async validate():Promise<boolean> {
		ExtensionOutput.appendLine("Validating Config File");
		if (!doesPathExist(this.project_folder)) {
			this.errors.push("Project path does not exist");
		}
		let splitJavadoc = this.JAVDOC?.split(this.file_seperator) ?? [];
		if (!doesPathExist(this.JAVDOC)) {
			this.errors.push("Cannot find the specified Javadoc executable");
		}
		else if (!splitJavadoc[splitJavadoc.length-1].toLowerCase().trim().includes("javadoc")) {
			this.errors.push("The javadoc executable path should end in with the executable file name and extension.");
		}
		ExtensionOutput.appendLine(` errors ${this.errors.length}`);
		await this.saveFile();
		return this.errors.length == 0;
	}
	static async load(settings:JavaSettings, config_path:string) {
		if (!doesPathExist(config_path)) return  new JDGConfig(settings, "");
		try {

		} catch (e){}
		let parent_path = path.resolve(config_path, "./");
		const content = fs.readFileSync(config_path, "utf-8");
		let config_string = content.split("==== CONFIGS ====")[1];
		config_string = config_string.split("====")[0];
		let configs = JSON.parse(config_string.trim())
        let CONFIG = new JDGConfig(settings, configs.base_path)
		CONFIG.dist_folder = configs.out
		CONFIG.JAVDOC = configs.javadoc_executable
		CONFIG.excluded_folders = configs.exclude
		CONFIG.config_path = config_path;
		CONFIG.raw_params = configs.raw_params;
		return CONFIG;
	}
	toString() {
		let str ="";
		str += (
			`==== CONFIGS ====		
${JSON.stringify({
	"base_path":this.project_folder ? this.project_folder : "UNDEFINED",
	"out":this.dist_folder,
	"javadoc_executable":this.JAVDOC,
	"exclude":this.excluded_folders,
	"raw_params":this.raw_params
}, null, 4)}

`
		);
		if (this.errors.length == 0) str += (
			`==== COMMAND ====
${this.toJDocCommand(true)}


`
		);
		if (this.errors.length > 0) str += (
			`==== ERRORS ====
\t${this.errors.join("\n\t")}


`
		);
		else if (this.results) { 
			str += (
				`==== JAVADOC OUTPUT ====
${this.results.stdout}

`
			);
            
		}
		return str;
	}

	toJDocCommand(multiline?:boolean) {
		const javadoc_executable = `"${this.JAVDOC}"`;
		const sourcepath = `-sourcepath "${this.project_folder}"`;
		const distpath = `-d "${this.dist_folder}"`;
		const files = fromDir(this.project_folder, ".java").map(file=>`"${file}"`);
		const filteredFiles = files.filter(file=>{
			for (let i = 0; i < this.excluded_folders.length; i++) {
				if (file.includes(this.excluded_folders[i])) return false;
			}
			return true;
		})
		const checkEmptyRawParams = ()=>{
			if (this.raw_params == undefined) return false
			if (this.raw_params.trim() == "") return false
			return true;
		}
		let rawParams = ""
		if (checkEmptyRawParams())
			rawParams = this.raw_params

		if (multiline == true) {
			if (checkEmptyRawParams()) rawParams = "\n\t"+rawParams
			return `${javadoc_executable} \n\t${sourcepath} \n\t${distpath} ${rawParams}\n\t${filteredFiles.join("\n\t")}`;
		}
		return `${javadoc_executable} ${sourcepath} ${distpath} ${rawParams}${filteredFiles.join(" ")}`;
	}
	async runJavadoc() {
		if (!await this.validate()) {
			vscode.window.showErrorMessage("JDG: Please fix errors with config file before running");
			return;
		}
		vscode.window.showInformationMessage("Generating Javadoc");
		const results = await execute(this.toJDocCommand());
		this.results = {
			"stdout":results,
		};
		this.saveFile();
	}
}

function fromDir(startPath:string|undefined, filter:string):string[] {
	ExtensionOutput.appendLine("searching: " + startPath + " for "+filter);
	if (startPath == undefined || !doesPathExist(startPath)) {
		ExtensionOutput.appendLine("folder doesn't exists " + startPath);
		return [];
	}
	ExtensionOutput.appendLine("folder exists " + startPath);

	const files = fs.readdirSync(startPath);
	const found = [];
	for (let i = 0; i < files.length; i++) {
		const filename = path.join(startPath, files[i]);
		const stat = fs.lstatSync(filename);
		if (stat.isDirectory()) {
			found.push(...fromDir(filename, filter)); //recurse
		} else if (filename.endsWith(filter)) {
			found.push(filename);
		}
	}
	return found;
}

export function doesPathExist(src_folder:string|undefined):src_folder is string {
	if (src_folder == undefined) return false;
	try {
		const stats = fs.statSync(src_folder);
		if (stats.isDirectory()) return true; 
		if (stats.isFile()) return true; 
	} catch (e){}
	return false;
}

export function getProjectFolder() {
	let fPath = vscode.window.activeTextEditor?.document.uri.fsPath;
	if (fPath == undefined) fPath = vscode.workspace.workspaceFile?.fsPath;
	if (fPath != undefined) fPath = path.join(fPath, "../");
	if (fPath == undefined) fPath = vscode.window.activeTextEditor?.document.fileName;

	if (fPath == undefined) return {project_folder:undefined, src_folder:undefined};
	let src_folder:string|undefined = undefined;
	if (fPath.includes("src")) {
		fPath = fPath.split("src")[0];
		src_folder = fPath+"src";
	} else {
		src_folder = path.join(fPath, "./src");
		if (src_folder != undefined) {
			const doesExist = doesPathExist(src_folder);
			if (!doesExist) src_folder = undefined;
		}
	}
	return {project_folder:fPath, src_folder};
}
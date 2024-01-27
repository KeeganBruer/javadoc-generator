import * as vscode from "vscode";
export class JavaSettings {
	settings:{[key:string]:string};
	constructor() {
		this.settings = {};
	}
	async load() {
		const stdout = await execute("java -XshowSettings:properties -version");
		const prop_lines = stdout.split("\n");
        
		for (let i = 0; i < prop_lines.length; i++) {
			if (prop_lines[i].includes("=")) {
				const splits =  prop_lines[i].split("=");
				const k = splits[0].trim();
				const v = splits[1].trim();
				this.settings[k] = v;
			}
		}
	}
	get(key:string) {
		return this.settings[key];
	}
}

import {exec} from "child_process";
export function execute(command:string):Promise<string>{
	return new Promise((resolve)=>{
		exec(command, function(error:any, stdout:string, stderr:string){ 
			resolve(stdout+stderr); 
		});
	});
}
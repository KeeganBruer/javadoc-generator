"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.JavaSettings = void 0;
class JavaSettings {
    constructor() {
        this.settings = {};
    }
    async load() {
        let stdout = await execute("java -XshowSettings:properties -version");
        let prop_lines = stdout.split("\n");
        for (let i = 0; i < prop_lines.length; i++) {
            if (prop_lines[i].includes("=")) {
                let splits = prop_lines[i].split("=");
                let k = splits[0].trim();
                let v = splits[1].trim();
                this.settings[k] = v;
            }
        }
    }
    get(key) {
        return this.settings[key];
    }
}
exports.JavaSettings = JavaSettings;
const child_process_1 = require("child_process");
function execute(command) {
    return new Promise((resolve) => {
        (0, child_process_1.exec)(command, function (error, stdout, stderr) {
            resolve(stdout + stderr);
        });
    });
}
exports.execute = execute;
;
//# sourceMappingURL=JavaSettings.js.map
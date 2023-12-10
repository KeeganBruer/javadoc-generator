"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForCompletion = exports.useShell = void 0;
const vscode = require("vscode");
async function useShell(cb) {
    const terminal = vscode.window.createTerminal(``);
    terminal.show();
    await cb(terminal);
    terminal.sendText("exit");
    return await waitForCompletion(terminal);
}
exports.useShell = useShell;
function waitForCompletion(terminal) {
    return new Promise((resolve, reject) => {
        const disposeToken = vscode.window.onDidCloseTerminal(async (closedTerminal) => {
            if (closedTerminal === terminal) {
                disposeToken.dispose();
                if (terminal.exitStatus !== undefined) {
                    resolve(terminal.exitStatus);
                }
                else {
                    reject("Terminal exited with undefined status");
                }
            }
        });
    });
}
exports.waitForCompletion = waitForCompletion;
//# sourceMappingURL=ShellHelper.js.map
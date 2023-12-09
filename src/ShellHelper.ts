import * as vscode from 'vscode';

export async function useShell(cb:(terminal:vscode.Terminal)=>Promise<void>) {
    const terminal = vscode.window.createTerminal(``);
    terminal.show();
    await cb(terminal)
    terminal.sendText("exit");
    await waitForCompletion(terminal)
}

export function waitForCompletion(terminal:vscode.Terminal) {
    return new Promise((resolve, reject) => {
        const disposeToken = vscode.window.onDidCloseTerminal(
          async (closedTerminal) => {
            if (closedTerminal === terminal) {
              disposeToken.dispose();
              if (terminal.exitStatus !== undefined) {
                resolve(terminal.exitStatus);
              } else {
                reject("Terminal exited with undefined status");
              }
            }
          }
        );
    });
}
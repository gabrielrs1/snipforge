import * as vscode from "vscode";

let storedCode: string | null = null;

export function activate(context: vscode.ExtensionContext) {
  let forgeDisposable = vscode.commands.registerCommand("ext.forgeTest", () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      if (selectedText.trim() !== "") {
        storedCode = selectedText;
      }
    }
  });

  let pasteDisposable = vscode.commands.registerCommand(
    "ext.pasteForgeTest",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (editor && storedCode) {
        const methodName = generateTestMethodName(storedCode);
        const testMethodName = forgeTestMethod(methodName);

        editor.edit((editBuilder) => {
          editBuilder.insert(editor.selection.active, testMethodName);
        });
      }
    }
  );

  context.subscriptions.push(forgeDisposable, pasteDisposable);
}

function generateTestMethodName(text: string): string[] {
  const lines = text.split("\n");
  let listMethodName = [];

  for (let i = 0; i < lines.length; i++) {
    const code = lines[i].trim();

    if (code.substring(0, 6) === "Method") {
      const methodName = code.split(" ")[1].split("(")[0];
      const testMethodName = `Test${methodName}`;

      listMethodName.push(testMethodName);
    }
  }

  return listMethodName;
}

function forgeTestMethod(methodsName: string[]): string {
  let methods = "";

  for (let i = 0; i < methodsName.length; i++) {
    const testMethodName = methodsName[i];
    let testMethod = "";

    if (i + 1 === methodsName.length) {
      testMethod = `Method ${testMethodName}() As %Status\n{\n\tQuit $$$OK\n}`;
    } else {
      testMethod = `Method ${testMethodName}() As %Status\n{\n\tQuit $$$OK\n}\n\n`;
    }

    methods += testMethod;
  }

  return methods;
}

export function deactivate() {}

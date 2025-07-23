"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
let storedCode = null;
function activate(context) {
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
    let pasteDisposable = vscode.commands.registerCommand("ext.pasteForgeTest", () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && storedCode) {
            const methodName = generateTestMethodName(storedCode);
            const testMethodName = forgeTestMethod(methodName);
            editor.edit((editBuilder) => {
                editBuilder.insert(editor.selection.active, testMethodName);
            });
        }
    });
    context.subscriptions.push(forgeDisposable, pasteDisposable);
}
function generateTestMethodName(text) {
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
function forgeTestMethod(methodsName) {
    let methods = "";
    for (let i = 0; i < methodsName.length; i++) {
        const testMethodName = methodsName[i];
        let testMethod = "";
        if (i + 1 === methodsName.length) {
            testMethod = `Method ${testMethodName}() As %Status\n{\n\tQuit $$$OK\n}`;
        }
        else {
            testMethod = `Method ${testMethodName}() As %Status\n{\n\tQuit $$$OK\n}\n\n`;
        }
        methods += testMethod;
    }
    return methods;
}
function deactivate() { }
//# sourceMappingURL=extension.js.map
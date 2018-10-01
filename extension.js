// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

function scanContextLines(editor, depth, lineNumber) {
    var line = editor.document.lineAt(lineNumber);
    var totalLines = editor.document.lineCount;
    if(depth > totalLines - lineNumber) depth = totalLines - lineNumber;
    var maxCol = line.range[1].character;
    while(depth > 0){
        line = editor.document.lineAt(lineNumber + depth);
        if(line.range[1].character > maxCol) maxCol = line.range[1].character;
        depth -= 1;
    }
    return maxCol;

}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "inline-comment-formatter" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposableInit = vscode.commands.registerCommand('extension.inlineInit', function () {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Inline executed');        

    });
    let disposableTrigger = vscode.commands.registerCommand('extension.triggerInlineComment', function() {
        // This will be called once the cursor is on a line asking for a flexbox
        // console.log("Key registered");
        if(vscode.window.activeTextEditor === undefined || 
            vscode.window.activeTextEditor.document === undefined){
            return;
        }
        // vscode.window.showInformationMessage("Triggered!");
        // Not a cursor position method, BUT 
        var editor = vscode.window.activeTextEditor

        // If nothing is selected, selection will work as a position for cursor.
        if(editor.selection.isEmpty){
            var position = editor.selection.active;
            var lineNumber = position.line
            var depth = 5;
            var line = editor.document.lineAt(lineNumber);
            var totalLines = editor.document.lineCount;
            if(depth > totalLines - lineNumber) depth = totalLines - lineNumber;
            var maxCol = line.range[1].character;
            while(depth > 0){
                line = editor.document.lineAt(lineNumber + depth);
                if(line.range[1].character > maxCol) maxCol = line.range[1].character;
                depth -= 1;
            }
            console.log(scanContextLines(editor, 5, lineNumber));

        }

    })
    context.subscriptions.push(disposableInit,disposableTrigger);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
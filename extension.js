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

    // Detect comment character         Make sure changes within different files types in workspace
    var commentType = "//"

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
            // Status
            var position = editor.selection.active;
            var lineNumber = position.line
            var line = editor.document.lineAt(lineNumber);
            var totalLines = editor.document.lineCount;

            // Constraints
            var blockDepth = 4;
            var flex = 7;

            // Limit blockDepth to lines available if block starts near the end of the file
            if(totalLines - lineNumber < blockDepth) blockDepth = totalLines - lineNumber

            // Existance Check for surrounding blocks
            // function existanceCheck(){

            // }

            // Current line check, snap to comment block if exists

            var lowerSearchBound = lineNumber - blockDepth
            if(lowerSearchBound < 0) lowerSearchBound = 0
            var upperSearchBound = lineNumber + blockDepth
            if(upperSearchBound > totalLines) upperSearchBound = totalLines

            for(let i = lowerSearchBound; i < upperSearchBound; i++){
                // Check if there is a block
                //   traverse through line from back 
                let codeBlockStart = editor.document.lineAt(i).text.indexOf(commentType)
                if(codeBlockStart != -1) console.log("Code block at", codeBlockStart)
            }

            // Decide start of block, recheck and shift if exists on current line


            // If the next n[depth] lines expand by [flex], then start the code block later
            //   Also, view the previous [depth] lines to see if a block has already been started. 

            // blockWidth represents the width of the current block which will not be wider then
            //   the current lines width + flex

            var blockWidth = line.range.end.character
            console.log(line.text, blockDepth, blockWidth )

            // Loop 
            while(blockDepth > 0){
                console.log("Inspecting line", lineNumber + blockDepth)
                let inspectingLineWidth = editor.document.lineAt(lineNumber + blockDepth).range.end.character;
                if(inspectingLineWidth > blockWidth && inspectingLineWidth < blockWidth + flex)
                {
                    flex = flex - (inspectingLineWidth - blockWidth)
                    blockWidth = inspectingLineWidth
                }
                blockDepth -= 1
            }
            console.log("Comment block while start at", blockWidth)
            
            // Move cursor and start comment block
            vscode.commands.executeCommand("cursorMove", {to: "wrappedLineEnd"});


        }
        else
        // Lines were selected
            // if a comment block exists, then reposition all comment lines to match
            // else, make a comment block that will fit selected lines. Permission to ignore flex.
        {

        }

    })
    context.subscriptions.push(disposableInit,disposableTrigger);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    // No code necessary
    // The keybind should be disconnected once the extension isn't running
}
exports.deactivate = deactivate;
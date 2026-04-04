import * as vscode from "vscode";

/**
 * Adds "⚡ Review with CodeSense AI" CodeLens above the first line of every supported file.
 */
export class CodeSenseCodeLensProvider implements vscode.CodeLensProvider {
  private readonly _onDidChangeCodeLenses = new vscode.EventEmitter<void>();
  readonly onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;

  refresh(): void {
    this._onDidChangeCodeLenses.fire();
  }

  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const config = vscode.workspace.getConfiguration("codesense");
    if (!config.get<boolean>("showCodeLens", true)) return [];

    const topRange = new vscode.Range(0, 0, 0, 0);

    return [
      new vscode.CodeLens(topRange, {
        title: "⚡ Review with CodeSense AI",
        command: "codesense.reviewFile",
        tooltip: "Analyze this file with AI (Ctrl+Shift+R)",
      }),
      new vscode.CodeLens(topRange, {
        title: "🔍 Review selection",
        command: "codesense.reviewSelection",
        tooltip: "Analyze selected code with AI",
      }),
    ];
  }
}

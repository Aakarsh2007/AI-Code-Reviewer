import * as vscode from "vscode";

export class StatusBarManager {
  private readonly item: vscode.StatusBarItem;

  constructor() {
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.item.command = "codesense.reviewFile";
  }

  show(): void {
    this.setIdle();
    this.item.show();
  }

  setIdle(): void {
    this.item.text = "$(sparkle) CodeSense";
    this.item.tooltip = "Click to review current file (Ctrl+Shift+R)";
    this.item.backgroundColor = undefined;
  }

  setAnalyzing(): void {
    this.item.text = "$(loading~spin) Analyzing...";
    this.item.tooltip = "CodeSense AI is analyzing your code";
  }

  dispose(): void {
    this.item.dispose();
  }
}

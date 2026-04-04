import * as vscode from "vscode";
import type { CodeIssue } from "../types";

export class DiagnosticsManager {
  private readonly collection = vscode.languages.createDiagnosticCollection("codesense");

  applyDiagnostics(uri: vscode.Uri, issues: CodeIssue[]): void {
    const config = vscode.workspace.getConfiguration("codesense");
    if (!config.get<boolean>("showInlineDecorations", true)) {
      this.collection.clear();
      return;
    }

    const diagnostics: vscode.Diagnostic[] = issues.map((issue) => {
      const lineNum = Math.max(0, (parseInt(String(issue.line)) || 1) - 1);
      const range = new vscode.Range(lineNum, 0, lineNum, Number.MAX_SAFE_INTEGER);

      const diag = new vscode.Diagnostic(
        range,
        `[${issue.type.toUpperCase()}] ${issue.description}`,
        this.mapSeverity(issue.severity)
      );
      diag.source = "CodeSense AI";
      diag.code = issue.type;
      return diag;
    });

    this.collection.set(uri, diagnostics);
  }

  clear(): void {
    this.collection.clear();
  }

  dispose(): void {
    this.collection.dispose();
  }

  private mapSeverity(severity: string): vscode.DiagnosticSeverity {
    switch (severity) {
      case "critical":
      case "high":
        return vscode.DiagnosticSeverity.Error;
      case "medium":
        return vscode.DiagnosticSeverity.Warning;
      default:
        return vscode.DiagnosticSeverity.Information;
    }
  }
}

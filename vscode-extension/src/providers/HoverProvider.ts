import * as vscode from "vscode";
import { DiagnosticsManager } from "../diagnostics/DiagnosticsManager";

/**
 * Shows AI-generated fix suggestions when hovering over a diagnostic issue line.
 */
export class CodeSenseHoverProvider implements vscode.HoverProvider {
  constructor(private readonly diagnostics: DiagnosticsManager) {}

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.Hover | undefined {
    const diags = vscode.languages.getDiagnostics(document.uri).filter(
      (d) => d.source === "CodeSense AI" && d.range.contains(position)
    );

    if (diags.length === 0) return undefined;

    const md = new vscode.MarkdownString("", true);
    md.isTrusted = true;
    md.supportHtml = true;

    md.appendMarkdown(`**⚡ CodeSense AI** — ${diags.length} issue(s) on this line\n\n`);
    md.appendMarkdown("---\n\n");

    for (const d of diags) {
      const icon = d.severity === vscode.DiagnosticSeverity.Error ? "🔴" :
                   d.severity === vscode.DiagnosticSeverity.Warning ? "🟡" : "🔵";
      md.appendMarkdown(`${icon} ${d.message}\n\n`);
    }

    md.appendMarkdown(
      `[$(sparkle) Review Full File](command:codesense.reviewFile) · ` +
      `[$(search) Review Selection](command:codesense.reviewSelection)`
    );

    return new vscode.Hover(md, diags[0].range);
  }
}

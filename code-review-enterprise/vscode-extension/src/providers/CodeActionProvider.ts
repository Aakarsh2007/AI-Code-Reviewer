import * as vscode from "vscode";
import { ReviewManager } from "../review/ReviewManager";

/**
 * Provides quick-fix lightbulb actions on lines with CodeSense diagnostics.
 */
export class CodeSenseCodeActionProvider implements vscode.CodeActionProvider {
  static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];

  constructor(private readonly reviewManager: ReviewManager) {}

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext
  ): vscode.CodeAction[] {
    const codesenseDiags = context.diagnostics.filter(
      (d) => d.source === "CodeSense AI"
    );

    if (codesenseDiags.length === 0) return [];

    const actions: vscode.CodeAction[] = [];

    // Action: Review full file to get refactored code
    const reviewAction = new vscode.CodeAction(
      "⚡ CodeSense AI: Review & fix this file",
      vscode.CodeActionKind.QuickFix
    );
    reviewAction.command = {
      command: "codesense.reviewFile",
      title: "Review file with CodeSense AI",
    };
    reviewAction.diagnostics = codesenseDiags;
    reviewAction.isPreferred = true;
    actions.push(reviewAction);

    // Action: Review selection
    const selectionAction = new vscode.CodeAction(
      "🔍 CodeSense AI: Review selected code",
      vscode.CodeActionKind.QuickFix
    );
    selectionAction.command = {
      command: "codesense.reviewSelection",
      title: "Review selection with CodeSense AI",
    };
    selectionAction.diagnostics = codesenseDiags;
    actions.push(selectionAction);

    // Action: Open diff viewer
    const lastReview = this.reviewManager.getLastReview();
    if (lastReview?.refactored_code) {
      const diffAction = new vscode.CodeAction(
        "🔀 CodeSense AI: View AI refactored diff",
        vscode.CodeActionKind.QuickFix
      );
      diffAction.command = {
        command: "codesense.openDiff",
        title: "Open diff viewer",
      };
      diffAction.diagnostics = codesenseDiags;
      actions.push(diffAction);
    }

    return actions;
  }
}

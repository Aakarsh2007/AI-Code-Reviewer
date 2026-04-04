import * as vscode from "vscode";
import type { ReviewResponse } from "../types";
import { ReviewManager } from "../review/ReviewManager";

export class HistoryTreeItem extends vscode.TreeItem {
  constructor(
    public readonly review: ReviewResponse,
    public readonly index: number
  ) {
    const score = review.code_quality_score;
    const icon = score >= 8 ? "✅" : score >= 5 ? "⚠️" : "❌";
    super(
      `${icon} ${review.language.toUpperCase()} — Score: ${score}/10`,
      vscode.TreeItemCollapsibleState.Collapsed
    );
    this.description = review.cached ? "⚡ cached" : undefined;
    this.tooltip = `${review.issues.length} issue(s) · ${review.time_complexity} · ${review.space_complexity}`;
    this.iconPath = new vscode.ThemeIcon(score >= 8 ? "pass" : score >= 5 ? "warning" : "error");
    this.contextValue = "historyItem";
  }
}

export class HistoryDetailItem extends vscode.TreeItem {
  constructor(label: string, description?: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.description = description;
    this.iconPath = new vscode.ThemeIcon("info");
  }
}

export class HistoryTreeProvider
  implements vscode.TreeDataProvider<HistoryTreeItem | HistoryDetailItem>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private readonly reviewManager: ReviewManager) {
    reviewManager.onReviewComplete(() => this.refresh());
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: HistoryTreeItem | HistoryDetailItem) {
    return element;
  }

  getChildren(
    element?: HistoryTreeItem | HistoryDetailItem
  ): (HistoryTreeItem | HistoryDetailItem)[] {
    if (!element) {
      return this.reviewManager
        .getHistory()
        .map((r, i) => new HistoryTreeItem(r, i));
    }

    if (element instanceof HistoryTreeItem) {
      const r = element.review;
      return [
        new HistoryDetailItem("Quality Score", `${r.code_quality_score}/10`),
        new HistoryDetailItem("Time Complexity", r.time_complexity),
        new HistoryDetailItem("Space Complexity", r.space_complexity),
        new HistoryDetailItem("Issues", `${r.issues.length} found`),
        new HistoryDetailItem("Suggestions", `${r.suggestions.length} available`),
        new HistoryDetailItem("Test Cases", `${r.test_cases.length} generated`),
      ];
    }

    return [];
  }
}

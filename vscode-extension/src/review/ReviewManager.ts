import * as vscode from "vscode";
import axios from "axios";
import { AuthManager } from "../auth/AuthManager";
import { DiagnosticsManager } from "../diagnostics/DiagnosticsManager";
import { StatusBarManager } from "../ui/StatusBarManager";
import type { ReviewResponse } from "../types";

const SUPPORTED_LANGUAGES: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
  cpp: "cpp",
  c: "c",
  go: "go",
  rust: "rust",
  csharp: "csharp",
  javascriptreact: "javascript",
  typescriptreact: "typescript",
};

const HISTORY_KEY = "codesense.history";
const MAX_HISTORY = 50;

export class ReviewManager {
  private _onReviewComplete = new vscode.EventEmitter<ReviewResponse>();
  readonly onReviewComplete = this._onReviewComplete.event;

  private _history: ReviewResponse[];
  private _lastReview: ReviewResponse | undefined;

  constructor(
    private readonly auth: AuthManager,
    private readonly diagnostics: DiagnosticsManager,
    private readonly statusBar: StatusBarManager,
    private readonly context: vscode.ExtensionContext
  ) {
    // Restore persisted history
    this._history = context.globalState.get<ReviewResponse[]>(HISTORY_KEY, []);
    this._lastReview = this._history[0];
  }

  async reviewActiveFile(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage("CodeSense AI: No active file to review.");
      return;
    }
    await this.reviewDocument(editor.document);
  }

  async reviewSelection(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.selection.isEmpty) {
      vscode.window.showWarningMessage("CodeSense AI: Select some code first.");
      return;
    }
    const code = editor.document.getText(editor.selection);
    const language = this.detectLanguage(editor.document.languageId);
    if (!language) {
      vscode.window.showWarningMessage(`CodeSense AI: Language "${editor.document.languageId}" is not supported.`);
      return;
    }
    await this.performReview(code, language, editor.document.uri);
  }

  async reviewDocument(doc: vscode.TextDocument): Promise<void> {
    const language = this.detectLanguage(doc.languageId);
    if (!language) {
      vscode.window.showWarningMessage(`CodeSense AI: Language "${doc.languageId}" is not supported.`);
      return;
    }
    const code = doc.getText();
    if (!code.trim()) {
      vscode.window.showWarningMessage("CodeSense AI: File is empty.");
      return;
    }
    await this.performReview(code, language, doc.uri);
  }

  async openDiff(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !this._lastReview?.refactored_code) {
      vscode.window.showWarningMessage("CodeSense AI: No refactored code available. Review a file first.");
      return;
    }

    const original = editor.document.uri;
    const refactored = await this._createTempDocument(
      this._lastReview.refactored_code,
      editor.document.languageId
    );

    await vscode.commands.executeCommand(
      "vscode.diff",
      original,
      refactored,
      `CodeSense AI: Original ↔ Refactored (${this._lastReview.language})`
    );
  }

  async copyRefactoredCode(): Promise<void> {
    if (!this._lastReview?.refactored_code) {
      vscode.window.showWarningMessage("CodeSense AI: No refactored code available.");
      return;
    }
    await vscode.env.clipboard.writeText(this._lastReview.refactored_code);
    vscode.window.showInformationMessage("✅ CodeSense AI: Refactored code copied to clipboard.");
  }

  async applyRefactoredCode(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !this._lastReview?.refactored_code) {
      vscode.window.showWarningMessage("CodeSense AI: No refactored code to apply.");
      return;
    }

    const confirm = await vscode.window.showWarningMessage(
      "Replace the entire file with AI-refactored code?",
      { modal: true },
      "Apply"
    );
    if (confirm !== "Apply") return;

    const fullRange = new vscode.Range(
      editor.document.positionAt(0),
      editor.document.positionAt(editor.document.getText().length)
    );

    await editor.edit((editBuilder) => {
      editBuilder.replace(fullRange, this._lastReview!.refactored_code);
    });

    vscode.window.showInformationMessage("✅ CodeSense AI: Refactored code applied.");
  }

  private async performReview(
    code: string,
    language: string,
    uri: vscode.Uri
  ): Promise<void> {
    if (!this.auth.isAuthenticated) {
      const action = await vscode.window.showWarningMessage(
        "CodeSense AI: Sign in to analyze code.",
        "Sign In"
      );
      if (action === "Sign In") await this.auth.promptLogin();
      return;
    }

    this.statusBar.setAnalyzing();

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "CodeSense AI",
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: `Analyzing ${language} code...`, increment: 10 });

        try {
          progress.report({ message: "Sending to AI engine...", increment: 30 });

          const { data } = await axios.post<ReviewResponse>(
            `${this.auth.getApiUrl()}/api/review`,
            { code, language },
            {
              headers: { Authorization: `Bearer ${this.auth.token}` },
              timeout: 60000,
            }
          );

          progress.report({ message: "Processing results...", increment: 50 });

          this._lastReview = data;
          this._history = [data, ...this._history].slice(0, MAX_HISTORY);
          await this.context.globalState.update(HISTORY_KEY, this._history);

          this.diagnostics.applyDiagnostics(uri, data.issues);
          this._onReviewComplete.fire(data);

          progress.report({ message: "Done!", increment: 100 });

          const score = data.code_quality_score;
          const emoji = score >= 8 ? "✅" : score >= 5 ? "⚠️" : "❌";
          const cacheNote = data.cached ? " (cached)" : "";

          const action = await vscode.window.showInformationMessage(
            `${emoji} CodeSense AI: Score ${score}/10 — ${data.issues.length} issue(s)${cacheNote}`,
            "View Diff",
            "Copy Refactored"
          );

          if (action === "View Diff") await this.openDiff();
          if (action === "Copy Refactored") await this.copyRefactoredCode();

        } catch (err: any) {
          if (err.code === "ECONNREFUSED") {
            vscode.window.showErrorMessage(
              "CodeSense AI: Cannot connect to API. Check your API URL in settings.",
              "Open Settings"
            ).then((a) => {
              if (a === "Open Settings") {
                vscode.commands.executeCommand("workbench.action.openSettings", "codesense.apiUrl");
              }
            });
          } else if (err.response?.status === 429) {
            vscode.window.showWarningMessage("CodeSense AI: Rate limit reached. Try again in 15 minutes.");
          } else if (err.response?.status === 401) {
            vscode.window.showErrorMessage("CodeSense AI: Session expired. Please sign in again.", "Sign In")
              .then((a) => { if (a === "Sign In") this.auth.promptLogin(); });
          } else {
            vscode.window.showErrorMessage(
              `CodeSense AI: ${err.response?.data?.message ?? err.message}`
            );
          }
        } finally {
          this.statusBar.setIdle();
        }
      }
    );
  }

  private detectLanguage(langId: string): string {
    return SUPPORTED_LANGUAGES[langId] ?? "";
  }

  private async _createTempDocument(content: string, langId: string): Promise<vscode.Uri> {
    const doc = await vscode.workspace.openTextDocument({
      content,
      language: langId,
    });
    return doc.uri;
  }

  getHistory(): ReviewResponse[] {
    return this._history;
  }

  getLastReview(): ReviewResponse | undefined {
    return this._lastReview;
  }

  clearHistory(): void {
    this._history = [];
    this._lastReview = undefined;
    this.context.globalState.update(HISTORY_KEY, []);
    this.diagnostics.clear();
    vscode.window.showInformationMessage("CodeSense AI: History cleared.");
  }
}

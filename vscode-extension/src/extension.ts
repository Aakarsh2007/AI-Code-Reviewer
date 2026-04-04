import * as vscode from "vscode";
import { AuthManager } from "./auth/AuthManager";
import { ReviewManager } from "./review/ReviewManager";
import { ReviewPanelProvider } from "./panels/ReviewPanelProvider";
import { DiagnosticsManager } from "./diagnostics/DiagnosticsManager";
import { StatusBarManager } from "./ui/StatusBarManager";
import { CodeSenseHoverProvider } from "./providers/HoverProvider";
import { CodeSenseCodeActionProvider } from "./providers/CodeActionProvider";
import { CodeSenseCodeLensProvider } from "./providers/CodeLensProvider";
import { HistoryTreeProvider } from "./tree/HistoryTreeProvider";

const SUPPORTED_DOCUMENT_SELECTORS: vscode.DocumentSelector = [
  { language: "javascript" },
  { language: "typescript" },
  { language: "javascriptreact" },
  { language: "typescriptreact" },
  { language: "python" },
  { language: "java" },
  { language: "cpp" },
  { language: "c" },
  { language: "go" },
  { language: "rust" },
  { language: "csharp" },
];

export function activate(context: vscode.ExtensionContext) {
  // ── Core services ──────────────────────────────────────────────────────────
  const authManager = new AuthManager(context);
  const diagnosticsManager = new DiagnosticsManager();
  const statusBar = new StatusBarManager();
  const reviewManager = new ReviewManager(authManager, diagnosticsManager, statusBar, context);

  // ── Providers ──────────────────────────────────────────────────────────────
  const panelProvider = new ReviewPanelProvider(context, authManager, reviewManager);
  const hoverProvider = new CodeSenseHoverProvider(diagnosticsManager);
  const codeActionProvider = new CodeSenseCodeActionProvider(reviewManager);
  const codeLensProvider = new CodeSenseCodeLensProvider();
  const historyTreeProvider = new HistoryTreeProvider(reviewManager);

  // ── Webview sidebar ────────────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("codesense.panel", panelProvider, {
      webviewOptions: { retainContextWhenHidden: true },
    })
  );

  // ── Tree view (History) ────────────────────────────────────────────────────
  const historyTree = vscode.window.createTreeView("codesense.history", {
    treeDataProvider: historyTreeProvider,
    showCollapseAll: true,
  });
  context.subscriptions.push(historyTree);

  // ── Language feature providers ─────────────────────────────────────────────
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(SUPPORTED_DOCUMENT_SELECTORS, hoverProvider),
    vscode.languages.registerCodeActionsProvider(
      SUPPORTED_DOCUMENT_SELECTORS,
      codeActionProvider,
      { providedCodeActionKinds: CodeSenseCodeActionProvider.providedCodeActionKinds }
    ),
    vscode.languages.registerCodeLensProvider(SUPPORTED_DOCUMENT_SELECTORS, codeLensProvider)
  );

  // ── Commands ───────────────────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand("codesense.reviewFile", () =>
      reviewManager.reviewActiveFile()
    ),
    vscode.commands.registerCommand("codesense.reviewSelection", () =>
      reviewManager.reviewSelection()
    ),
    vscode.commands.registerCommand("codesense.openDiff", () =>
      reviewManager.openDiff()
    ),
    vscode.commands.registerCommand("codesense.copyRefactored", () =>
      reviewManager.copyRefactoredCode()
    ),
    vscode.commands.registerCommand("codesense.applyRefactored", () =>
      reviewManager.applyRefactoredCode()
    ),
    vscode.commands.registerCommand("codesense.openPanel", () =>
      vscode.commands.executeCommand("workbench.view.extension.codesense")
    ),
    vscode.commands.registerCommand("codesense.login", () =>
      authManager.promptLogin()
    ),
    vscode.commands.registerCommand("codesense.logout", async () => {
      await authManager.logout();
      vscode.window.showInformationMessage("CodeSense AI: Signed out.");
    }),
    vscode.commands.registerCommand("codesense.clearHistory", () =>
      reviewManager.clearHistory()
    ),
    vscode.commands.registerCommand("codesense.clearDiagnostics", () => {
      diagnosticsManager.clear();
      vscode.window.showInformationMessage("CodeSense AI: Diagnostics cleared.");
    }),
    vscode.commands.registerCommand("codesense.openSettings", () =>
      vscode.commands.executeCommand("workbench.action.openSettings", "codesense")
    )
  );

  // ── Auto-review on save ────────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((doc) => {
      const config = vscode.workspace.getConfiguration("codesense");
      if (config.get<boolean>("autoReviewOnSave", false)) {
        reviewManager.reviewDocument(doc);
      }
    })
  );

  // ── Config change: refresh CodeLens ───────────────────────────────────────
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("codesense.showCodeLens")) {
        codeLensProvider.refresh();
      }
    })
  );

  // ── Cleanup ────────────────────────────────────────────────────────────────
  context.subscriptions.push(diagnosticsManager, statusBar);

  statusBar.show();
}

export function deactivate() {}

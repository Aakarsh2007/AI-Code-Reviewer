import * as vscode from "vscode";
import { AuthManager } from "../auth/AuthManager";
import { ReviewManager } from "../review/ReviewManager";
import type { ReviewResponse } from "../types";

export class ReviewPanelProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private _currentReview?: ReviewResponse;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly auth: AuthManager,
    private readonly reviewManager: ReviewManager
  ) {
    reviewManager.onReviewComplete((review) => {
      this._currentReview = review;
      this._postMessage({ type: "reviewComplete", review });
    });

    auth.onAuthChange((isAuth) => {
      this._postMessage({ type: "authChange", isAuthenticated: isAuth, user: auth.user });
    });
  }

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this._getHtml();

    webviewView.webview.onDidReceiveMessage(async (msg) => {
      switch (msg.type) {
        case "login":          await this.auth.promptLogin(); break;
        case "logout":         await this.auth.logout(); break;
        case "reviewFile":     await this.reviewManager.reviewActiveFile(); break;
        case "reviewSelection":await this.reviewManager.reviewSelection(); break;
        case "openDiff":       await this.reviewManager.openDiff(); break;
        case "copyRefactored": await this.reviewManager.copyRefactoredCode(); break;
        case "applyRefactored":await this.reviewManager.applyRefactoredCode(); break;
        case "openSettings":
          vscode.commands.executeCommand("workbench.action.openSettings", "codesense");
          break;
        case "getState":
          this._postMessage({
            type: "state",
            isAuthenticated: this.auth.isAuthenticated,
            user: this.auth.user,
            review: this._currentReview,
          });
          break;
      }
    });
  }

  private _postMessage(msg: object): void {
    this._view?.webview.postMessage(msg);
  }

  private _getHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
<title>CodeSense AI</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:var(--vscode-editor-background);
  --fg:var(--vscode-editor-foreground);
  --border:var(--vscode-panel-border,rgba(255,255,255,0.1));
  --muted:var(--vscode-descriptionForeground);
  --accent:#22c55e;
  --accent-dim:rgba(34,197,94,0.12);
  --accent-border:rgba(34,197,94,0.3);
  --card:var(--vscode-sideBar-background);
  --btn-bg:var(--vscode-button-background);
  --btn-fg:var(--vscode-button-foreground);
  --btn-hover:var(--vscode-button-hoverBackground);
  --input-bg:var(--vscode-input-background);
  --error:#f87171;--warn:#fbbf24;--info:#60a5fa;
}
body{font-family:var(--vscode-font-family);font-size:12px;color:var(--fg);background:var(--bg);padding:10px;line-height:1.55;overflow-x:hidden}
/* Header */
.header{display:flex;align-items:center;gap:8px;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--border)}
.logo{width:22px;height:22px;background:var(--accent-dim);border:1px solid var(--accent-border);border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0}
.title{font-weight:700;font-size:13px;letter-spacing:-0.01em}
.badge{font-size:9px;color:var(--accent);background:var(--accent-dim);border:1px solid var(--accent-border);padding:1px 6px;border-radius:10px;margin-left:auto;letter-spacing:0.05em;text-transform:uppercase}
/* Buttons */
.btn{width:100%;padding:7px 10px;border:none;border-radius:5px;cursor:pointer;font-size:12px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:6px;transition:all 0.15s;font-family:inherit}
.btn:hover{filter:brightness(1.1)}
.btn:active{transform:scale(0.98)}
.btn-primary{background:var(--accent);color:#052e16}
.btn-secondary{background:var(--btn-bg);color:var(--btn-fg)}
.btn-secondary:hover{background:var(--btn-hover)}
.btn-ghost{background:transparent;color:var(--muted);border:1px solid var(--border)}
.btn-ghost:hover{color:var(--fg);border-color:var(--fg)}
.btn-sm{padding:4px 8px;font-size:11px;width:auto}
.btn-row{display:flex;gap:6px;margin-top:6px}
.btn-row .btn{flex:1}
.btn+.btn{margin-top:5px}
/* Tabs */
.tabs{display:flex;gap:2px;margin-bottom:10px;background:var(--card);border:1px solid var(--border);border-radius:6px;padding:3px}
.tab{flex:1;padding:5px 4px;border:none;border-radius:4px;cursor:pointer;font-size:11px;font-weight:500;background:transparent;color:var(--muted);transition:all 0.15s;font-family:inherit}
.tab.active{background:var(--accent-dim);color:var(--accent);border:1px solid var(--accent-border)}
.tab:hover:not(.active){color:var(--fg)}
/* Metrics */
.metric-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;margin-bottom:10px}
.metric{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:7px 8px}
.metric-label{font-size:9px;color:var(--muted);margin-bottom:2px;text-transform:uppercase;letter-spacing:0.05em}
.metric-value{font-size:13px;font-weight:700;font-family:var(--vscode-editor-font-family,monospace)}
.score-good{color:var(--accent)}.score-warn{color:var(--warn)}.score-bad{color:var(--error)}
/* Issues */
.issue{padding:7px 9px;border-radius:5px;border:1px solid;margin-bottom:5px;font-size:11px}
.issue-bug{border-color:rgba(248,113,113,0.3);background:rgba(248,113,113,0.07)}
.issue-performance{border-color:rgba(251,191,36,0.3);background:rgba(251,191,36,0.07)}
.issue-security{border-color:rgba(251,113,133,0.3);background:rgba(251,113,133,0.07)}
.issue-style{border-color:rgba(147,197,253,0.3);background:rgba(147,197,253,0.07)}
.issue-header{display:flex;align-items:center;gap:5px;margin-bottom:3px;flex-wrap:wrap}
.issue-type{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em}
.issue-line{font-size:9px;color:var(--muted)}
.severity{font-size:9px;padding:1px 5px;border-radius:3px;border:1px solid}
.sev-critical,.sev-high{color:var(--error);border-color:rgba(248,113,113,0.4);background:rgba(248,113,113,0.1)}
.sev-medium{color:var(--warn);border-color:rgba(251,191,36,0.4);background:rgba(251,191,36,0.1)}
.sev-low{color:var(--info);border-color:rgba(96,165,250,0.4);background:rgba(96,165,250,0.1)}
/* Suggestions */
.suggestion{padding:6px 9px;background:var(--card);border:1px solid var(--border);border-radius:5px;margin-bottom:4px;font-size:11px;display:flex;gap:6px}
.suggestion::before{content:"→";color:var(--accent);flex-shrink:0;font-weight:700}
/* Test cases */
.test-case{background:var(--card);border:1px solid var(--border);border-radius:5px;padding:7px 9px;margin-bottom:5px;font-size:11px}
.tc-row{display:flex;gap:6px;margin-bottom:3px;align-items:baseline}
.tc-label{color:var(--muted);font-size:10px;width:52px;flex-shrink:0}
.tc-code{font-family:var(--vscode-editor-font-family,monospace);font-size:10px;background:rgba(255,255,255,0.05);padding:1px 5px;border-radius:3px;color:var(--accent)}
.tc-exp{color:var(--muted);font-size:10px;margin-top:3px;line-height:1.4}
/* Section */
.section{margin-bottom:12px}
.section-title{font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:7px;display:flex;align-items:center;gap:5px}
.count{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:0 5px;font-size:9px}
/* Auth */
.auth-section{text-align:center;padding:24px 0}
.auth-icon{font-size:36px;margin-bottom:12px}
.auth-section p{color:var(--muted);margin-bottom:14px;font-size:11px;line-height:1.5}
/* User info */
.user-info{display:flex;align-items:center;justify-content:space-between;padding:6px 9px;background:var(--card);border:1px solid var(--border);border-radius:5px;margin-bottom:10px;font-size:11px}
.user-email{color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:140px}
/* Empty */
.empty{text-align:center;padding:28px 0;color:var(--muted);font-size:11px}
.empty-icon{font-size:30px;margin-bottom:8px}
/* Badges */
.cached-badge{display:inline-flex;align-items:center;gap:4px;font-size:10px;color:var(--accent);background:var(--accent-dim);border:1px solid var(--accent-border);padding:2px 8px;border-radius:10px;margin-bottom:8px}
.divider{border:none;border-top:1px solid var(--border);margin:10px 0}
/* Action row */
.action-row{display:flex;gap:5px;margin-bottom:10px}
.action-row .btn{flex:1;font-size:10px;padding:5px 6px}
/* Scrollable */
.scroll-area{max-height:calc(100vh - 200px);overflow-y:auto;padding-right:2px}
.scroll-area::-webkit-scrollbar{width:4px}
.scroll-area::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
</style>
</head>
<body>
<div class="header">
  <div class="logo">⚡</div>
  <span class="title">CodeSense AI</span>
  <span class="badge">Enterprise</span>
</div>
<div id="app"></div>
<script>
const vscode = acquireVsCodeApi();
let state = { isAuthenticated: false, user: null, review: null, tab: 'issues' };

function render() {
  const app = document.getElementById('app');
  if (!state.isAuthenticated) {
    app.innerHTML = \`
      <div class="auth-section">
        <div class="auth-icon">🔐</div>
        <p>Sign in to start reviewing code with AI-powered analysis directly in VS Code.</p>
        <button class="btn btn-primary" onclick="send('login')">Sign In to CodeSense AI</button>
        <button class="btn btn-ghost" style="margin-top:6px" onclick="send('openSettings')">⚙️ Configure API URL</button>
      </div>
    \`;
    return;
  }

  const r = state.review;
  app.innerHTML = \`
    <div class="user-info">
      <span class="user-email">👤 \${state.user?.email ?? 'User'}</span>
      <button class="btn btn-ghost btn-sm" onclick="send('logout')">Sign out</button>
    </div>
    <button class="btn btn-primary" onclick="send('reviewFile')">⚡ Review Current File</button>
    <button class="btn btn-secondary" onclick="send('reviewSelection')">🔍 Review Selection</button>
    \${r ? \`
    <div class="action-row" style="margin-top:6px">
      <button class="btn btn-ghost" onclick="send('openDiff')" title="Ctrl+Shift+D">🔀 Diff</button>
      <button class="btn btn-ghost" onclick="send('copyRefactored')" title="Ctrl+Shift+C">📋 Copy</button>
      <button class="btn btn-ghost" onclick="send('applyRefactored')">✅ Apply</button>
    </div>
    \` : ''}
    <hr class="divider">
    \${r ? renderReview(r) : \`
      <div class="empty">
        <div class="empty-icon">✨</div>
        <p>Press <strong>Ctrl+Shift+R</strong> to analyze the current file, or use the buttons above.</p>
      </div>
    \`}
  \`;
}

function renderReview(r) {
  const sc = r.code_quality_score;
  const scoreClass = sc >= 8 ? 'score-good' : sc >= 5 ? 'score-warn' : 'score-bad';
  const icons = { bug:'🐛', performance:'⚡', style:'🎨', security:'🔒' };

  const tabs = ['issues','suggestions','tests'];
  const tabLabels = { issues:\`Issues (\${r.issues.length})\`, suggestions:\`Hints (\${r.suggestions.length})\`, tests:\`Tests (\${r.test_cases.length})\` };

  let content = '';
  if (state.tab === 'issues') {
    content = r.issues.length === 0
      ? '<div class="empty" style="padding:12px 0"><p>✅ No issues detected!</p></div>'
      : r.issues.map(i => \`
          <div class="issue issue-\${i.type}">
            <div class="issue-header">
              <span>\${icons[i.type]??'⚠️'}</span>
              <span class="issue-type">\${i.type}</span>
              <span class="issue-line">Line \${i.line}</span>
              <span class="severity sev-\${i.severity}">\${i.severity}</span>
            </div>
            <div>\${i.description}</div>
          </div>
        \`).join('');
  } else if (state.tab === 'suggestions') {
    content = r.suggestions.length === 0
      ? '<div class="empty" style="padding:12px 0"><p>No suggestions.</p></div>'
      : r.suggestions.map(s => \`<div class="suggestion">\${s}</div>\`).join('');
  } else {
    content = r.test_cases.length === 0
      ? '<div class="empty" style="padding:12px 0"><p>No test cases generated.</p></div>'
      : r.test_cases.map(tc => \`
          <div class="test-case">
            <div class="tc-row"><span class="tc-label">Input</span><code class="tc-code">\${tc.input}</code></div>
            <div class="tc-row"><span class="tc-label">Expected</span><code class="tc-code" style="color:#86efac">\${tc.expected_output}</code></div>
            <div class="tc-exp">\${tc.explanation}</div>
          </div>
        \`).join('');
  }

  return \`
    \${r.cached ? '<div class="cached-badge">⚡ Served from cache</div>' : ''}
    <div class="metric-grid">
      <div class="metric"><div class="metric-label">Score</div><div class="metric-value \${scoreClass}">\${sc}/10</div></div>
      <div class="metric"><div class="metric-label">Time</div><div class="metric-value">\${r.time_complexity}</div></div>
      <div class="metric"><div class="metric-label">Space</div><div class="metric-value">\${r.space_complexity}</div></div>
    </div>
    <div class="tabs">
      \${tabs.map(t => \`<button class="tab \${state.tab===t?'active':''}" onclick="setTab('\${t}')">\${tabLabels[t]}</button>\`).join('')}
    </div>
    <div class="scroll-area">\${content}</div>
  \`;
}

function send(type, data) { vscode.postMessage({ type, ...data }); }
function setTab(tab) { state.tab = tab; render(); }

window.addEventListener('message', e => {
  const msg = e.data;
  if (msg.type === 'state') {
    state = { ...state, isAuthenticated: msg.isAuthenticated, user: msg.user, review: msg.review };
    render();
  } else if (msg.type === 'authChange') {
    state.isAuthenticated = msg.isAuthenticated;
    state.user = msg.user ?? null;
    if (!msg.isAuthenticated) state.review = null;
    render();
  } else if (msg.type === 'reviewComplete') {
    state.review = msg.review;
    state.tab = 'issues';
    render();
  }
});

send('getState');
</script>
</body>
</html>`;
  }
}

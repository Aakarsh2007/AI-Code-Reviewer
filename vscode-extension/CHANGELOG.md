# Changelog

## [2.0.0] — Enterprise Release

### Added
- HoverProvider: AI issue details on hover with quick-action links
- CodeActionProvider: Lightbulb quick-fix actions on diagnostic lines
- CodeLensProvider: "Review with CodeSense AI" lens above every file
- TreeView: Review History panel in the activity bar sidebar
- `openDiff` command: Native VS Code diff editor (original ↔ AI refactored)
- `copyRefactored` command: Copy AI refactored code to clipboard
- `applyRefactored` command: Replace file content with AI refactored code
- Tabbed webview panel: Issues / Suggestions / Test Cases
- Persistent history: Stored in `globalState`, survives restarts
- Progress reporting with incremental steps
- Smart error handling: rate limit, auth expiry, connection refused
- `showCodeLens` configuration option
- `maxHistoryItems` configuration option
- Walkthrough guide for new users
- `.vscodeignore` for clean packaging

### Changed
- ReviewManager now accepts `ExtensionContext` for state persistence
- Status bar shows animated spinner during analysis
- Notification includes "View Diff" and "Copy Refactored" action buttons
- Language detection extended to `javascriptreact` and `typescriptreact`

## [1.0.0] — Initial Release
- Basic file and selection review
- Inline diagnostics
- Sidebar webview panel
- JWT authentication

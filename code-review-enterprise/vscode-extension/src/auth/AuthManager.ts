import * as vscode from "vscode";
import axios from "axios";

const TOKEN_KEY = "codesense.token";
const USER_KEY = "codesense.user";

export interface AuthUser {
  id: string;
  email: string;
}

export class AuthManager {
  private _onAuthChange = new vscode.EventEmitter<boolean>();
  readonly onAuthChange = this._onAuthChange.event;

  constructor(private readonly context: vscode.ExtensionContext) {}

  get token(): string | undefined {
    return this.context.globalState.get<string>(TOKEN_KEY);
  }

  get user(): AuthUser | undefined {
    return this.context.globalState.get<AuthUser>(USER_KEY);
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  async promptLogin(): Promise<boolean> {
    const email = await vscode.window.showInputBox({
      prompt: "Enter your CodeSense AI email",
      placeHolder: "you@company.com",
      validateInput: (v) => (v.includes("@") ? null : "Enter a valid email"),
    });
    if (!email) return false;

    const password = await vscode.window.showInputBox({
      prompt: "Enter your password",
      password: true,
      placeHolder: "••••••••",
    });
    if (!password) return false;

    return vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: "Signing in to CodeSense AI..." },
      async () => {
        try {
          const apiUrl = this.getApiUrl();
          const { data } = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
          await this.context.globalState.update(TOKEN_KEY, data.token);
          await this.context.globalState.update(USER_KEY, data.user);
          this._onAuthChange.fire(true);
          vscode.window.showInformationMessage(`✅ Signed in as ${data.user.email}`);
          return true;
        } catch (err: any) {
          vscode.window.showErrorMessage(
            `Sign in failed: ${err.response?.data?.message ?? err.message}`
          );
          return false;
        }
      }
    );
  }

  async logout(): Promise<void> {
    await this.context.globalState.update(TOKEN_KEY, undefined);
    await this.context.globalState.update(USER_KEY, undefined);
    this._onAuthChange.fire(false);
  }

  getApiUrl(): string {
    return vscode.workspace
      .getConfiguration("codesense")
      .get<string>("apiUrl", "http://localhost:3000");
  }
}

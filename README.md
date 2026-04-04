<div align="center">

<br/>

<img width="80" src="https://img.shields.io/badge/-%E2%9A%A1-22c55e?style=for-the-badge&logoColor=white"/>

# CodeSense AI

### Enterprise-Grade AI Code Review Platform

**Analyze · Detect Bugs · Scan Security · Refactor — in seconds**

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_14-App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Python](https://img.shields.io/badge/Python_3.11-FastAPI-009688?style=for-the-badge&logo=python&logoColor=white)](https://fastapi.tiangolo.com)
[![VS Code](https://img.shields.io/badge/VS_Code-Extension-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)](#-vs-code-extension)

<br/>

[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-FF6B35?style=flat-square)](https://groq.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer](https://img.shields.io/badge/Framer_Motion-11-FF0055?style=flat-square&logo=framer&logoColor=white)](https://framer.com/motion)
[![Zustand](https://img.shields.io/badge/Zustand-State_Mgmt-orange?style=flat-square)](https://zustand-demo.pmnd.rs)
[![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1?style=flat-square)](https://zod.dev)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)

<br/>

> 🌐 **Web App** &nbsp;·&nbsp; 🔌 **VS Code Extension** &nbsp;·&nbsp; 🐍 **Python AI Microservice** &nbsp;·&nbsp; 🐳 **Docker Ready**

<br/>

</div>

---

## 📸 Screenshots

<div align="center">

| 🖥️ Main Editor | 📊 AI Analysis | 🔍 Diff Viewer |
|:-:|:-:|:-:|
| <img src="screenshots.png/Main.png" width="290" alt="Editor"/> | <img src="screenshots.png/analysis.png" width="290" alt="Analysis"/> | <img src="screenshots.png/diff.png" width="290" alt="Diff"/> |

| 📜 Review History | 🔐 Login | 🔄 Reset Password |
|:-:|:-:|:-:|
| <img src="screenshots.png/history.png" width="290" alt="History"/> | <img src="screenshots.png/login.png" width="290" alt="Login"/> | <img src="screenshots.png/reset-password.png" width="290" alt="Reset"/> |

</div>

---

## 🏗️ System Architecture

```
╔══════════════════════════════════════════════════════════════════════╗
║                         CLIENT LAYER                                ║
║                                                                      ║
║  ┌──────────────────────────────┐  ┌──────────────────────────────┐ ║
║  │   🌐  Next.js 14 Web App     │  │   🔌  VS Code Extension      │ ║
║  │   TypeScript · Tailwind CSS  │  │   Webview · Diagnostics      │ ║
║  │   Framer Motion · Zustand    │  │   CodeLens · HoverProvider   │ ║
║  │   Monaco Editor              │  │   CodeAction · TreeView      │ ║
║  └──────────────┬───────────────┘  └──────────────┬───────────────┘ ║
╚═════════════════╪══════════════════════════════════╪════════════════╝
                  │  HTTPS + JWT Bearer              │  HTTPS + JWT Bearer
╔═════════════════▼══════════════════════════════════▼════════════════╗
║                      API GATEWAY LAYER                              ║
║              Next.js 14 API Routes  ·  TypeScript                   ║
║                                                                      ║
║   POST  /api/auth/register          POST  /api/auth/login           ║
║   POST  /api/auth/forgot-password   POST  /api/auth/reset-password  ║
║   POST  /api/review                 GET   /api/history              ║
║   DELETE /api/history/:id           GET   /api/stats                ║
║                                                                      ║
║   ✓ Zod validation  ✓ JWT auth  ✓ Redis rate limiting              ║
║   ✓ Security headers middleware  ✓ Error boundaries                 ║
╚══════════════════════════════╤══════════════════════════════════════╝
                               │  Internal HTTP + JWT
╔══════════════════════════════▼══════════════════════════════════════╗
║                    AI MICROSERVICE LAYER                            ║
║              Python 3.11  ·  FastAPI  ·  Uvicorn                    ║
║                                                                      ║
║   POST  /api/v1/review/analyze                                      ║
║   GET   /api/v1/review/history/:userId                              ║
║   DELETE /api/v1/review/history/:id                                 ║
║   GET   /health  ·  /health/ready                                   ║
║                                                                      ║
║   ✓ Groq LLaMA 3.3 70B  ✓ Pydantic v2  ✓ Motor async MongoDB      ║
║   ✓ SHA-256 Redis cache  ✓ slowapi rate limiting                    ║
╚══════════════════════════════════════════════════════════════════════╝
              │                                │
    ┌─────────▼──────────┐         ┌──────────▼──────────┐
    │  📦  MongoDB Atlas  │         │  ⚡  Redis Cloud     │
    │  Users · Reviews    │         │  OTP · Code Cache   │
    └────────────────────┘         └─────────────────────┘
```

---

## ✨ Core Features

<table>
<tr>
<td width="50%" valign="top">

### 🤖 AI Analysis Engine
- **LLaMA 3.3 70B** via Groq — fastest LLM inference
- Bug detection, security scanning, performance review
- Code style & best practices analysis
- Automatic **Big-O time & space complexity**
- AI-generated **edge case test cases**
- Full **refactored code** output with diff viewer

</td>
<td width="50%" valign="top">

### ⚡ Performance & Caching
- **SHA-256 Redis cache** — identical code served instantly
- **24h TTL** on code review results
- **Async FastAPI** — non-blocking Python AI service
- **Next.js App Router** — server components + streaming
- **Zustand persist** — state survives page refresh
- Sub-3-second analysis on cache hits

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🔐 Security Architecture
- **JWT HS256** — 7-day expiry, stateless
- **bcrypt** — cost factor 12
- **6-digit OTP** via Nodemailer + Redis (15min TTL)
- **Redis rate limiting** — 5 req / 15 min per user
- **Zod + Pydantic v2** input validation on every endpoint
- Security headers middleware on all responses

</td>
<td width="50%" valign="top">

### 🖥️ VS Code Extension
- **CodeLens** — review lens above every file
- **Inline diagnostics** — issues in gutter + Problems panel
- **HoverProvider** — AI issue details on hover
- **CodeAction** — lightbulb quick-fix actions
- **TreeView** — history panel in activity bar
- **Diff viewer** — original ↔ AI refactored

</td>
</tr>
</table>

---

## 📁 Project Structure

```
📦 AI-Code-Reviewer/  (repository root)
│
├── 🌐 web/                              ← Next.js 14 + TypeScript  [Deploy to Vercel]
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── register/route.ts      POST — bcrypt + JWT
│   │   │   │   │   ├── login/route.ts         POST — credential validation
│   │   │   │   │   ├── forgot-password/route.ts  POST — Redis OTP + Nodemailer
│   │   │   │   │   └── reset-password/route.ts   POST — OTP verify + hash
│   │   │   │   ├── review/route.ts            POST — proxies to Python AI service
│   │   │   │   ├── history/
│   │   │   │   │   ├── route.ts               GET — fetch user history
│   │   │   │   │   └── [id]/route.ts          DELETE — remove review
│   │   │   │   └── stats/route.ts             GET — aggregate stats
│   │   │   ├── globals.css                    Design tokens + glass UI + animations
│   │   │   ├── layout.tsx                     Root layout + Inter + JetBrains Mono
│   │   │   ├── page.tsx                       Auth gate → Dashboard
│   │   │   ├── loading.tsx                    Next.js loading boundary
│   │   │   └── error.tsx                      Next.js error boundary
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── AuthPage.tsx               Split layout with branding + stats
│   │   │   │   ├── LoginForm.tsx              Email + password + show/hide
│   │   │   │   ├── RegisterForm.tsx           Password strength indicator
│   │   │   │   └── ResetPasswordFlow.tsx      3-step OTP flow
│   │   │   ├── dashboard/
│   │   │   │   ├── Dashboard.tsx              Main layout shell
│   │   │   │   ├── Navbar.tsx                 Logo + user menu + extension link
│   │   │   │   ├── EditorPanel.tsx            Monaco editor + status bar
│   │   │   │   ├── ResultsPanel.tsx           Tabbed results + loading overlay
│   │   │   │   └── tabs/
│   │   │   │       ├── MetricsTab.tsx         Score gauge + issues + suggestions + tests
│   │   │   │       ├── DiffTab.tsx            Monaco DiffEditor
│   │   │   │       └── HistoryTab.tsx         Review history list
│   │   │   └── ui/
│   │   │       └── CopyButton.tsx             Clipboard copy with feedback
│   │   ├── lib/
│   │   │   ├── db.ts                          Mongoose connection (cached)
│   │   │   ├── redis.ts                       Redis client (singleton)
│   │   │   ├── auth.ts                        JWT verify helper
│   │   │   ├── rateLimit.ts                   Redis sliding window rate limiter
│   │   │   └── utils.ts                       cn · formatDate · score colors
│   │   ├── middleware.ts                       Security headers on all routes
│   │   ├── models/User.ts                     Mongoose User model (TypeScript)
│   │   ├── store/
│   │   │   ├── auth.ts                        Zustand auth store (persisted)
│   │   │   └── review.ts                      Zustand review store (persisted)
│   │   └── types/index.ts                     Shared TypeScript interfaces
│   ├── Dockerfile
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── 🐍 ai-service/                       ← Python FastAPI  [Deploy to Railway/Render]
│   ├── main.py                          App factory + CORS + lifecycle hooks
│   ├── app/
│   │   ├── config.py                    pydantic-settings env config
│   │   ├── database.py                  Motor (async MongoDB) + async Redis
│   │   ├── models.py                    Pydantic v2 request/response schemas
│   │   ├── auth.py                      Internal JWT verification
│   │   ├── routers/
│   │   │   ├── review.py                analyze · history · delete endpoints
│   │   │   └── health.py                /health · /health/ready
│   │   └── services/
│   │       ├── ai_service.py            Groq async client + structured JSON output
│   │       └── cache_service.py         SHA-256 Redis cache layer
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
│
├── 🔌 vscode-extension/                 ← VS Code Extension TypeScript  [Package as .vsix]
│   ├── src/
│   │   ├── extension.ts                 Activation — registers all providers & commands
│   │   ├── auth/AuthManager.ts          Token storage via VS Code globalState
│   │   ├── review/ReviewManager.ts      File · selection · diff · apply · copy logic
│   │   ├── diagnostics/DiagnosticsManager.ts  Inline issue decorations
│   │   ├── providers/
│   │   │   ├── HoverProvider.ts         Hover tooltips on issue lines
│   │   │   ├── CodeActionProvider.ts    Lightbulb quick-fix actions
│   │   │   └── CodeLensProvider.ts      Review lens above every file
│   │   ├── tree/HistoryTreeProvider.ts  Sidebar history TreeView
│   │   ├── ui/StatusBarManager.ts       Status bar item with spinner
│   │   └── panels/ReviewPanelProvider.ts  Webview sidebar panel
│   ├── assets/
│   │   ├── icon-mono.svg
│   │   └── walkthrough/                 Getting started guide (3 steps)
│   ├── CHANGELOG.md
│   ├── .vscodeignore
│   └── package.json
│
├── 📸 screenshots.png/                  App screenshots
├── 🐳 docker-compose.yml                One-command local setup (web + ai + redis)
├── 🔄 .github/workflows/ci.yml          GitHub Actions CI pipeline
├── 🚫 .gitignore
└── 📖 README.md                         ← You are here
```

---

## 🔌 VS Code Extension

### ⬇️ How to Install

**Option 1 — VS Code Marketplace** *(after publishing)*
```
1. Open VS Code
2. Press Ctrl+Shift+X  →  search "CodeSense AI"
3. Click Install
```

**Option 2 — Build & install .vsix** *(use this now)*
```bash
# 1. Build
cd vscode-extension
npm install
npm run compile
npm run package
# → creates: codesense-ai-2.0.0.vsix

# 2. Install via CLI
code --install-extension codesense-ai-2.0.0.vsix

# OR via VS Code UI:
# Ctrl+Shift+P → "Extensions: Install from VSIX..." → select the .vsix file
```

**Option 3 — Dev mode (F5)**
```bash
cd vscode-extension
npm install && npm run compile
# Open the vscode-extension/ folder in VS Code
# Press F5 → Extension Development Host launches with extension active
```

### ⚙️ Configure the Extension
```
1. Ctrl+Shift+P → "Preferences: Open Settings (UI)"
2. Search: codesense
3. Set "CodeSense AI: Api Url" = https://your-app.vercel.app

4. Ctrl+Shift+P → "CodeSense AI: Sign In"
   → Enter your email + password
```

### ⌨️ Keyboard Shortcuts

| Action | Windows / Linux | Mac |
|:-------|:----------------|:----|
| Review current file | `Ctrl+Shift+R` | `Cmd+Shift+R` |
| Review selection | `Ctrl+Shift+S` | `Cmd+Shift+S` |
| Open diff viewer | `Ctrl+Shift+D` | `Cmd+Shift+D` |
| Copy refactored code | `Ctrl+Shift+C` | `Cmd+Shift+C` |

### 🧩 Extension Features

| Feature | Description |
|:--------|:------------|
| ⚡ **CodeLens** | "Review with CodeSense AI" lens above every supported file |
| 🐛 **Inline Diagnostics** | Issues in editor gutter + Problems panel with severity |
| 💡 **CodeAction** | Lightbulb quick-fix on every diagnostic line |
| 🖱️ **HoverProvider** | Hover over issue line → AI details + action links |
| 🌲 **TreeView** | Review History panel in the activity bar sidebar |
| 🔀 **Diff Viewer** | Native VS Code diff: original ↔ AI refactored |
| 📋 **Copy Refactored** | Copy AI-optimized code to clipboard |
| ✅ **Apply Refactored** | Replace file content with AI version (with confirmation) |
| 💾 **Persistent History** | Stored in `globalState` — survives VS Code restarts |
| 🚶 **Walkthrough** | Built-in getting started guide (Help → Get Started) |
| ⚙️ **Settings** | API URL · auto-review on save · CodeLens toggle · max history |

### 🗣️ Supported Languages
`javascript` · `typescript` · `javascriptreact` · `typescriptreact` · `python` · `java` · `cpp` · `c` · `go` · `rust` · `csharp`

---

## 🚀 Getting Started

### 🐳 Option A — Docker (Recommended)

```bash
git clone https://github.com/Aakarsh2007/AI-Code-Reviewer.git
cd AI-Code-Reviewer

# Fill in your environment variables
cp web/.env.example web/.env.local
cp ai-service/.env.example ai-service/.env

# Start everything with one command
docker-compose up --build
```

| Service | URL |
|:--------|:----|
| 🌐 Web App | http://localhost:3000 |
| 🐍 AI Service | http://localhost:8000/docs |
| ⚡ Redis | localhost:6379 |

---

### 🛠️ Option B — Manual Setup

**Step 1 — Python AI Service**
```bash
cd ai-service

python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env             # Fill in your values

uvicorn main:app --reload --port 8000
# → http://localhost:8000/docs (Swagger UI)
```

**Step 2 — Next.js Web App**
```bash
cd web

npm install
cp .env.example .env.local       # Fill in your values
npm run dev
# → http://localhost:3000
```

**Step 3 — VS Code Extension** *(optional)*
```bash
cd vscode-extension
npm install && npm run compile
# Press F5 in VS Code to test, or npm run package to build .vsix
```

---

## ⚙️ Environment Variables

### `web/.env.local`

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGO_DB_NAME=code_reviewer

# Cache
REDIS_URI=redis://localhost:6379

# Auth — minimum 32 characters
JWT_SECRET=your_super_secret_jwt_key_minimum_32_chars

# Email (Gmail App Password — 16 chars, no spaces)
EMAIL_USER=your@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop

# Python AI Service URL
AI_SERVICE_URL=http://localhost:8000
```

### `ai-service/.env`

```env
GROQ_API_KEY=gsk_your_groq_api_key_here
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
REDIS_URI=redis://localhost:6379
JWT_SECRET=same_secret_as_web_env_above
ALLOWED_ORIGINS=["http://localhost:3000"]
DEBUG=true
```

---

## 🌐 Deployment

### Vercel — Web App

```bash
cd web
npx vercel --prod
```

> In Vercel dashboard → **Settings → Root Directory → set to `web`**
> Then add all env vars from `web/.env.example`
> Set `AI_SERVICE_URL` to your Railway/Render URL

### Railway — AI Service

```bash
# In Railway dashboard:
# 1. Connect this GitHub repo
# 2. Set root directory: ai-service
# 3. Add all env vars from ai-service/.env.example
# Railway auto-detects the Dockerfile
```

### Connect Extension to Live Deployment

```
VS Code → Settings → Search "codesense"
→ CodeSense AI: Api Url = https://your-app.vercel.app
→ Ctrl+Shift+P → "CodeSense AI: Sign In"
```

> ✅ The extension now talks directly to your live Vercel deployment — no localhost needed.

---

## 🔐 Security Architecture

| Layer | Implementation |
|:------|:--------------|
| 🔑 **Passwords** | bcrypt — cost factor 12 |
| 🎫 **Sessions** | JWT HS256 — 7-day expiry, Zustand persist |
| 📧 **OTP Reset** | Redis TTL 900s — single-use, deleted on use |
| 🛡️ **Rate Limiting** | Redis sliding window — 5 req / 15 min per IP |
| ✅ **Input Validation** | Zod (TypeScript) + Pydantic v2 (Python) |
| 🔒 **Security Headers** | X-Frame-Options · X-Content-Type-Options · Referrer-Policy |
| 🌐 **CORS** | Explicit origin allowlist in Python service |
| 📬 **Email Enumeration** | Forgot password always returns 200 |
| 🔐 **Service Auth** | Python AI service validates JWT on every request |
| 🚫 **Code Execution** | Code sent as string payload — never executed server-side |

---

## 🔄 Password Reset Flow

```
User enters email
      │
      ▼
Generate 6-digit OTP
      │
      ├──▶ Store in Redis  (TTL: 15 minutes)
      │
      └──▶ Send via Nodemailer (Gmail)
                    │
                    ▼
            User enters OTP + new password
                    │
                    ▼
            Validate against Redis cache
                    │
              ┌─────┴──────┐
           ✅ Valid       ❌ Invalid / Expired
              │                    │
              ▼                    ▼
      Hash new password       Return 400
      Save to MongoDB
      Delete OTP from Redis
      Return 200 ✅
```

---

## 📡 API Reference

### 🔓 Authentication

| Method | Endpoint | Body | Description |
|:-------|:---------|:-----|:------------|
| `POST` | `/api/auth/register` | `{email, password}` | Create account → returns JWT |
| `POST` | `/api/auth/login` | `{email, password}` | Sign in → returns JWT |
| `POST` | `/api/auth/forgot-password` | `{email}` | Send 6-digit OTP via email |
| `POST` | `/api/auth/reset-password` | `{email, otp, password}` | Validate OTP → update password |

### 🔒 Review *(requires `Authorization: Bearer <token>`)*

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/review` | Analyze code — rate limited 5 req / 15 min |
| `GET` | `/api/history` | Fetch all user reviews |
| `DELETE` | `/api/history/:id` | Delete a specific review |
| `GET` | `/api/stats` | Aggregate stats (total · avg score · by language) |

### 🐍 AI Service *(internal, JWT protected)*

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/v1/review/analyze` | Run LLaMA 3.3 70B analysis |
| `GET` | `/api/v1/review/history/:userId` | Get user history |
| `DELETE` | `/api/v1/review/history/:id` | Delete review |
| `GET` | `/health` | Health check |

---

## 🛠️ Tech Stack

| Layer | Technology |
|:------|:----------|
| 🌐 **Frontend Framework** | Next.js 14 (App Router · Server Components) |
| 📝 **Language** | TypeScript 5.6 (strict mode throughout) |
| 🎨 **Styling** | Tailwind CSS 3.4 + custom design tokens |
| 🎬 **Animations** | Framer Motion 11 |
| 📝 **Code Editor** | Monaco Editor (same engine as VS Code) |
| 📦 **State Management** | Zustand 5 with persistence middleware |
| 🔧 **Backend API** | Next.js API Routes (TypeScript) |
| 🐍 **AI Microservice** | Python 3.11 · FastAPI · Uvicorn |
| 🤖 **AI Model** | Groq — LLaMA 3.3 70B Versatile |
| 🗄️ **Database** | MongoDB Atlas · Mongoose (TS) · Motor (Python async) |
| ⚡ **Cache** | Redis — OTP (15min TTL) + code cache (24h TTL) |
| 🔐 **Auth** | JWT HS256 · bcrypt (cost 12) |
| 📧 **Email** | Nodemailer · Gmail App Password |
| ✅ **Validation** | Zod (TypeScript) · Pydantic v2 (Python) |
| 🔌 **VS Code** | Extension API · Webview · Diagnostics · CodeLens · HoverProvider · CodeAction · TreeView |
| 🐳 **DevOps** | Docker · docker-compose · GitHub Actions CI |

---

## 👨‍💻 Author

<div align="center">

**Aakarsh Saxena**

*Aspiring AI Engineer & Full Stack Developer*
*B.Tech in Information Technology · IIIT Lucknow*

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-Aakarsh2007-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Aakarsh2007)

</div>

---

<div align="center">

## ⭐ Support

If this project helped you, please consider leaving a **star** on the repository!

[![Star on GitHub](https://img.shields.io/github/stars/Aakarsh2007/AI-Code-Reviewer?style=for-the-badge&logo=github&color=22c55e)](https://github.com/Aakarsh2007/AI-Code-Reviewer)

</div>

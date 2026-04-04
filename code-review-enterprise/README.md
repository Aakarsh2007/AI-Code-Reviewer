# ⚡ CodeSense AI — Enterprise Code Review Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_14-App_Router-black?logo=next.js&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Python_3.11-FastAPI-009688?logo=fastapi&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/VS_Code-Extension-007ACC?logo=visualstudiocode&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Groq-LLaMA_3.3_70B-FF6B35?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-Cache-DC382D?logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-11-FF0055?logo=framer&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-State-orange" />
  <img src="https://img.shields.io/badge/Zod-Validation-3E67B1" />
</p>

<p align="center">
  <em>
    Complete rewrite from React+Vite+Express → <strong>Next.js 14 + TypeScript + Python FastAPI</strong><br/>
    AI-powered code analysis, bug detection, security scanning, and refactoring —<br/>
    available as a <strong>web app</strong> and a <strong>VS Code extension</strong>.
  </em>
</p>

---

## 🔄 Migration: What Changed from v1

> The original project was built with **React + Vite** (frontend) and **Node.js + Express** (backend).
> This is a **complete enterprise rewrite** — every file has been replaced.

| Layer | Before (v1) | After (v2 — This Repo) |
|---|---|---|
| Frontend | React 19 + Vite | **Next.js 14 App Router + TypeScript** |
| Styling | Inline CSS | **Tailwind CSS + Framer Motion** |
| State | `useState` + `localStorage` | **Zustand with persistence** |
| Backend | Node.js + Express | **Next.js API Routes (TypeScript)** |
| AI Service | Node.js (Groq SDK) | **Python FastAPI + Groq async** |
| Validation | None | **Zod (TS) + Pydantic v2 (Python)** |
| Auth | JWT in localStorage | **JWT + Zustand persist + httpOnly ready** |
| Rate Limiting | `express-rate-limit` | **Redis sliding window (custom)** |
| Caching | Redis (basic) | **SHA-256 keyed Redis cache (24h TTL)** |
| VS Code | ❌ None | **✅ Full enterprise extension** |
| Docker | ❌ None | **✅ docker-compose.yml** |
| CI/CD | ❌ None | **✅ GitHub Actions** |
| TypeScript | ❌ None | **✅ Strict TypeScript everywhere** |

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                │
│                                                                      │
│  ┌─────────────────────────────┐  ┌──────────────────────────────┐  │
│  │   Next.js 14 Web App        │  │   VS Code Extension (TS)     │  │
│  │   TypeScript · Tailwind CSS │  │   Webview · Diagnostics      │  │
│  │   Framer Motion · Zustand   │  │   CodeLens · HoverProvider   │  │
│  │   Monaco Editor (same as    │  │   CodeAction · TreeView      │  │
│  │   VS Code's editor engine)  │  │   Diff · Apply · Copy        │  │
│  └──────────────┬──────────────┘  └──────────────┬───────────────┘  │
└─────────────────┼────────────────────────────────┼──────────────────┘
                  │ HTTPS / JWT Bearer              │ HTTPS / JWT Bearer
┌─────────────────▼────────────────────────────────▼──────────────────┐
│                     API GATEWAY LAYER                                │
│              Next.js 14 API Routes (TypeScript)                      │
│                                                                      │
│  POST /api/auth/register    POST /api/auth/login                     │
│  POST /api/auth/forgot-password                                      │
│  POST /api/auth/reset-password                                       │
│  POST /api/review           GET  /api/history                        │
│  DELETE /api/history/:id    GET  /api/stats                          │
│                                                                      │
│  ✓ Zod validation  ✓ JWT auth  ✓ Redis rate limiting                │
│  ✓ Security headers middleware  ✓ Error boundaries                   │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ Internal HTTP + JWT
┌──────────────────────────────▼───────────────────────────────────────┐
│                    AI MICROSERVICE LAYER                             │
│                  Python 3.11 · FastAPI · Uvicorn                     │
│                                                                      │
│  POST /api/v1/review/analyze                                         │
│  GET  /api/v1/review/history/:userId                                 │
│  DELETE /api/v1/review/history/:id                                   │
│  GET  /health                                                        │
│                                                                      │
│  ✓ Groq LLaMA 3.3 70B  ✓ Pydantic v2  ✓ Motor (async MongoDB)      │
│  ✓ SHA-256 Redis cache  ✓ slowapi rate limiting                      │
└──────────────────────────────────────────────────────────────────────┘
              │                                │
    ┌─────────▼──────────┐         ┌──────────▼──────────┐
    │   MongoDB Atlas     │         │   Redis Cloud        │
    │   Users · Reviews   │         │   OTP · Code Cache   │
    └────────────────────┘         └─────────────────────┘
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 AI Code Analysis | LLaMA 3.3 70B via Groq — bugs, security, performance, style |
| 📊 Complexity Metrics | Automatic Big-O time & space complexity with circular score gauge |
| 🔍 Diff Viewer | Side-by-side Monaco diff of original vs AI-refactored code |
| 🧪 Test Case Generation | AI-generated edge cases with inputs and expected outputs |
| 📜 Review History | Persistent history with load, delete, and score badges |
| ⚡ Redis Caching | SHA-256 keyed 24h cache — identical code served instantly |
| 🔐 JWT Auth | Stateless authentication with 7-day token expiry |
| 📧 OTP Reset | Redis-backed 15-minute OTP via Nodemailer |
| 🛡 Rate Limiting | Redis sliding window — 5 reviews per 15 min per user |
| 📋 Copy Refactored | One-click copy of AI-refactored code |
| 📈 Stats API | Aggregate review stats per user |
| 🖥 VS Code Extension | Full enterprise extension — see section below |
| 9 Languages | JS · TS · Python · Java · C++ · C · Go · Rust · C# |
| 🐳 Docker | Full `docker-compose.yml` for one-command local setup |
| 🔄 CI/CD | GitHub Actions — type-check, lint, compile, Docker build |
| 🎨 Enterprise UI | Dark theme, glass morphism, Framer Motion, dot-grid background |

---

## 🔌 VS Code Extension

### How to Install

**Option 1 — VS Code Marketplace (after publishing)**
```
1. Open VS Code
2. Press Ctrl+Shift+X (Extensions panel)
3. Search "CodeSense AI"
4. Click Install
```

**Option 2 — Install from .vsix file (local/dev)**
```bash
# Step 1: Build the extension
cd vscode-extension
npm install
npm run compile
npm run package        # → generates codesense-ai-2.0.0.vsix

# Step 2: Install in VS Code
# Method A — Command Palette:
#   Ctrl+Shift+P → "Extensions: Install from VSIX..." → select the .vsix file

# Method B — CLI:
code --install-extension codesense-ai-2.0.0.vsix
```

**Option 3 — Development mode (F5)**
```bash
cd vscode-extension
npm install
npm run compile
# Open the vscode-extension folder in VS Code
# Press F5 → launches Extension Development Host with the extension loaded
```

### Configure the Extension
After installing, set your API URL:
```
Ctrl+Shift+P → "Preferences: Open Settings (UI)"
→ Search "codesense"
→ Set "CodeSense AI: Api Url" to your deployed app URL
   e.g. https://your-app.vercel.app
```

Then sign in:
```
Ctrl+Shift+P → "CodeSense AI: Sign In"
```

### Extension Features

| Feature | Details |
|---|---|
| ⚡ CodeLens | "Review with CodeSense AI" lens above every supported file |
| 🐛 Inline Diagnostics | Issues appear in editor gutter + Problems panel with severity |
| 💡 CodeAction | Lightbulb quick-fix actions on every diagnostic line |
| 🖱 HoverProvider | Hover over an issue line → see AI details + action links |
| 🌲 TreeView | Review History panel in the activity bar sidebar |
| 🔀 Diff Command | Native VS Code diff editor: original ↔ AI refactored |
| 📋 Copy Refactored | Copy AI code to clipboard |
| ✅ Apply Refactored | Replace file content with AI version (with confirmation) |
| 💾 Persistent History | Stored in `globalState`, survives VS Code restarts (50 items) |
| 🚶 Walkthrough | Built-in getting started guide (Help → Get Started) |
| ⚙️ Settings | API URL, auto-review on save, CodeLens toggle, max history |
| 🎯 Smart Errors | Rate limit, auth expiry, connection refused — all handled gracefully |

### Keyboard Shortcuts

| Action | Windows / Linux | Mac |
|---|---|---|
| Review current file | `Ctrl+Shift+R` | `Cmd+Shift+R` |
| Review selection | `Ctrl+Shift+S` | `Cmd+Shift+S` |
| Open diff viewer | `Ctrl+Shift+D` | `Cmd+Shift+D` |
| Copy refactored code | `Ctrl+Shift+C` | `Cmd+Shift+C` |

### Supported Languages
`javascript` · `typescript` · `javascriptreact` · `typescriptreact` · `python` · `java` · `cpp` · `c` · `go` · `rust` · `csharp`

---

## 📁 Project Structure

```
code-review-enterprise/
│
├── 🌐 web/                              # Next.js 14 + TypeScript (FULL REWRITE)
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── register/route.ts    # POST — bcrypt + JWT
│   │   │   │   │   ├── login/route.ts       # POST — credential validation
│   │   │   │   │   ├── forgot-password/route.ts  # POST — Redis OTP + Nodemailer
│   │   │   │   │   └── reset-password/route.ts   # POST — OTP verify + hash
│   │   │   │   ├── review/route.ts          # POST — proxies to Python AI service
│   │   │   │   ├── history/
│   │   │   │   │   ├── route.ts             # GET — fetch user history
│   │   │   │   │   └── [id]/route.ts        # DELETE — remove review
│   │   │   │   └── stats/route.ts           # GET — aggregate stats
│   │   │   ├── globals.css                  # Tailwind + custom design tokens
│   │   │   ├── layout.tsx                   # Root layout + fonts + Toaster
│   │   │   ├── page.tsx                     # Auth gate → Dashboard
│   │   │   ├── loading.tsx                  # Next.js loading boundary
│   │   │   └── error.tsx                    # Next.js error boundary
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── AuthPage.tsx             # Split layout with branding panel
│   │   │   │   ├── LoginForm.tsx            # Email + password + show/hide
│   │   │   │   ├── RegisterForm.tsx         # Password strength indicator
│   │   │   │   └── ResetPasswordFlow.tsx    # 3-step OTP flow
│   │   │   ├── dashboard/
│   │   │   │   ├── Dashboard.tsx            # Main layout shell
│   │   │   │   ├── Navbar.tsx               # Logo + user menu + extension link
│   │   │   │   ├── EditorPanel.tsx          # Monaco editor + status bar
│   │   │   │   ├── ResultsPanel.tsx         # Tabbed results with loading overlay
│   │   │   │   └── tabs/
│   │   │   │       ├── MetricsTab.tsx       # Score gauge + issues + suggestions + tests
│   │   │   │       ├── DiffTab.tsx          # Monaco DiffEditor
│   │   │   │       └── HistoryTab.tsx       # Review history list
│   │   │   └── ui/
│   │   │       └── CopyButton.tsx           # Clipboard copy with feedback
│   │   ├── lib/
│   │   │   ├── db.ts                        # Mongoose connection (cached)
│   │   │   ├── redis.ts                     # Redis client (singleton)
│   │   │   ├── auth.ts                      # JWT verify helper
│   │   │   ├── rateLimit.ts                 # Redis sliding window rate limiter
│   │   │   └── utils.ts                     # cn, formatDate, score colors
│   │   ├── middleware.ts                     # Security headers on all routes
│   │   ├── models/
│   │   │   └── User.ts                      # Mongoose User model (TypeScript)
│   │   ├── store/
│   │   │   ├── auth.ts                      # Zustand auth store (persisted)
│   │   │   └── review.ts                    # Zustand review store (persisted)
│   │   └── types/
│   │       └── index.ts                     # Shared TypeScript interfaces
│   ├── Dockerfile
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── 🐍 ai-service/                       # Python FastAPI Microservice (NEW)
│   ├── main.py                          # App factory + middleware + lifecycle
│   ├── app/
│   │   ├── config.py                    # pydantic-settings env config
│   │   ├── database.py                  # Motor (async MongoDB) + async Redis
│   │   ├── models.py                    # Pydantic v2 request/response models
│   │   ├── auth.py                      # Internal JWT verification
│   │   ├── routers/
│   │   │   ├── review.py                # analyze · history · delete
│   │   │   └── health.py                # /health · /health/ready
│   │   └── services/
│   │       ├── ai_service.py            # Groq async client + structured output
│   │       └── cache_service.py         # SHA-256 Redis cache layer
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
│
├── 🔌 vscode-extension/                 # VS Code Extension TypeScript (NEW)
│   ├── src/
│   │   ├── extension.ts                 # Activation — registers all providers
│   │   ├── auth/AuthManager.ts          # Token storage via globalState
│   │   ├── review/ReviewManager.ts      # File/selection/diff/apply/copy logic
│   │   ├── diagnostics/DiagnosticsManager.ts  # Inline issue decorations
│   │   ├── providers/
│   │   │   ├── HoverProvider.ts         # Hover tooltips on issue lines
│   │   │   ├── CodeActionProvider.ts    # Lightbulb quick-fix actions
│   │   │   └── CodeLensProvider.ts      # Review lens above files
│   │   ├── tree/HistoryTreeProvider.ts  # Sidebar history TreeView
│   │   ├── ui/StatusBarManager.ts       # Status bar item
│   │   └── panels/ReviewPanelProvider.ts  # Webview sidebar panel
│   ├── assets/
│   │   ├── icon-mono.svg
│   │   └── walkthrough/                 # Getting started guide
│   ├── CHANGELOG.md
│   ├── .vscodeignore
│   └── package.json
│
├── 🐳 docker-compose.yml                # One-command: web + ai-service + redis
├── 🔄 .github/workflows/ci.yml          # GitHub Actions CI pipeline
├── 🚫 .gitignore
└── 📖 README.md
```

---

## 🚀 Getting Started

### Option A — Docker (Recommended, one command)

```bash
git clone https://github.com/your-username/codesense-ai
cd codesense-ai/code-review-enterprise

# Fill in environment variables
cp web/.env.example web/.env.local
cp ai-service/.env.example ai-service/.env
# Edit both files with your MongoDB URI, Redis URI, Groq API key, etc.

# Start everything
docker-compose up --build
```

- Web app → `http://localhost:3000`
- AI service → `http://localhost:8000`
- Redis → `localhost:6379`

---

### Option B — Manual Setup

**1. Python AI Service**
```bash
cd ai-service
python -m venv .venv

# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env        # fill in your values
uvicorn main:app --reload --port 8000
```

**2. Next.js Web App**
```bash
cd web
npm install
cp .env.example .env.local  # fill in your values
npm run dev                  # → http://localhost:3000
```

**3. VS Code Extension**
```bash
cd vscode-extension
npm install
npm run compile

# Option A: Press F5 in VS Code (opens Extension Development Host)
# Option B: Package as .vsix
npm run package
code --install-extension codesense-ai-2.0.0.vsix
```

---

## ⚙️ Environment Variables

### `web/.env.local`
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/
MONGO_DB_NAME=code_reviewer
REDIS_URI=redis://localhost:6379
JWT_SECRET=your_minimum_32_character_secret_key
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_16_char_google_app_password
AI_SERVICE_URL=http://localhost:8000
```

### `ai-service/.env`
```env
GROQ_API_KEY=gsk_...
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/
REDIS_URI=redis://localhost:6379
JWT_SECRET=same_secret_as_web_env
ALLOWED_ORIGINS=["http://localhost:3000"]
DEBUG=true
```

---

## 🌐 Deployment

### Can I test with my existing deployment link?

**Yes.** Here's the exact flow:

```
1. Push this repo to GitHub
2. Deploy web/ to Vercel:
   - Connect repo in Vercel dashboard
   - Set root directory to: code-review-enterprise/web
   - Add all env vars from web/.env.example
   - Deploy → get URL like https://codesense-ai.vercel.app

3. Deploy ai-service/ to Railway or Render:
   - Connect repo
   - Set root directory to: code-review-enterprise/ai-service
   - Add all env vars from ai-service/.env.example
   - Deploy → get URL like https://codesense-ai-service.railway.app

4. In Vercel, set:
   AI_SERVICE_URL=https://codesense-ai-service.railway.app

5. In VS Code extension settings:
   codesense.apiUrl = https://codesense-ai.vercel.app

6. Done — the extension talks to your live Vercel deployment.
```

### Vercel (Web)
```bash
cd web
npx vercel --prod
```

### Railway (AI Service)
```bash
# Dockerfile is auto-detected
railway up
```

---

## 🔐 Security Architecture

| Layer | Mechanism |
|---|---|
| Passwords | bcrypt (cost factor 12) |
| Sessions | JWT HS256, 7-day expiry, stored in Zustand persist |
| OTP | Redis TTL 900s, single-use, deleted immediately on use |
| Rate Limiting | Redis sliding window — 5 req / 15 min per IP |
| Input Validation | Zod (Next.js API routes) + Pydantic v2 (Python) |
| Security Headers | X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy |
| CORS | Explicit origin allowlist in Python service |
| Email Enumeration | Forgot password always returns 200 regardless of email existence |
| Service Auth | Python AI service validates JWT before accepting any request |
| Code Injection | All code is sent as a string payload, never executed server-side |

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | `{email, password}` | Create account, returns JWT |
| `POST` | `/api/auth/login` | `{email, password}` | Sign in, returns JWT |
| `POST` | `/api/auth/forgot-password` | `{email}` | Send 6-digit OTP via email |
| `POST` | `/api/auth/reset-password` | `{email, otp, password}` | Validate OTP, update password |

### Review (requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/review` | Analyze code — rate limited 5/15min |
| `GET` | `/api/history` | Fetch all user reviews |
| `DELETE` | `/api/history/:id` | Delete a specific review |
| `GET` | `/api/stats` | Aggregate stats (total, avg score, by language) |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | **Next.js 14** (App Router, Server Components) |
| Language | **TypeScript 5.6** (strict mode) |
| Styling | **Tailwind CSS 3.4** + custom design tokens |
| Animations | **Framer Motion 11** |
| Code Editor | **Monaco Editor** (same engine as VS Code) |
| State Management | **Zustand 5** with persistence middleware |
| Backend API | **Next.js API Routes** (TypeScript) |
| AI Microservice | **Python 3.11 + FastAPI + Uvicorn** |
| AI Model | **Groq — LLaMA 3.3 70B Versatile** |
| Database | **MongoDB Atlas** + Mongoose (TS) / Motor (Python async) |
| Cache | **Redis** — OTP (15min TTL) + code review cache (24h TTL) |
| Authentication | **JWT HS256** + **bcrypt** (cost 12) |
| Email | **Nodemailer** + Gmail App Password |
| Input Validation | **Zod** (TypeScript) + **Pydantic v2** (Python) |
| VS Code Extension | Extension API, Webview, Diagnostics, CodeLens, HoverProvider, CodeAction, TreeView |
| DevOps | **Docker** + **docker-compose** + **GitHub Actions** CI |

---

## 👨‍💻 Author

Built with ❤️ by **Aakarsh Saxena**
*B.Tech Information Technology · IIIT Lucknow*

---

## ⭐ Support

If this project helped you, consider leaving a ⭐ on the repository.

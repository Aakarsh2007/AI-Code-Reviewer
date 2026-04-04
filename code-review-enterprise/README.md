# ⚡ CodeSense AI — Enterprise Code Review Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/VS_Code_Extension-2.0-007ACC?logo=visualstudiocode&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-Cache-DC382D?logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-LLaMA_3.3_70B-FF6B35" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" />
  <img src="https://img.shields.io/github/actions/workflow/status/your-username/codesense-ai/ci.yml?label=CI&logo=github" />
</p>

<p align="center">
  <em>AI-powered code analysis, bug detection, security scanning, and refactoring — in your browser and directly inside VS Code.</em>
</p>

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                │
│  ┌───────────────────────────┐    ┌──────────────────────────────┐   │
│  │   Next.js 14 Web App      │    │   VS Code Extension (TS)     │   │
│  │   TypeScript + Tailwind   │    │   Webview · Diagnostics      │   │
│  │   Framer Motion · Zustand │    │   CodeLens · HoverProvider   │   │
│  │   Monaco Editor           │    │   CodeAction · TreeView      │   │
│  └────────────┬──────────────┘    └──────────────┬───────────────┘   │
└───────────────┼──────────────────────────────────┼───────────────────┘
                │ REST / JWT                        │ REST / JWT
┌───────────────▼──────────────────────────────────▼───────────────────┐
│                       API GATEWAY LAYER                              │
│                  Next.js API Routes (TypeScript)                     │
│   /api/auth/*  ·  /api/review  ·  /api/history/*  ·  /api/stats     │
│   Zod Validation  ·  JWT Auth  ·  Redis Rate Limiting               │
│   Security Headers Middleware                                        │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ Internal HTTP + JWT
┌──────────────────────────────▼───────────────────────────────────────┐
│                     AI MICROSERVICE LAYER                            │
│                   Python FastAPI (Async)                             │
│   Groq LLaMA 3.3 70B  ·  Redis Cache  ·  Motor (MongoDB async)     │
│   SHA-256 Code Hashing  ·  Pydantic v2  ·  slowapi Rate Limiting    │
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
| 📊 Complexity Metrics | Automatic Big-O time & space complexity |
| 🔍 Diff Viewer | Side-by-side Monaco diff of original vs AI-refactored code |
| 🧪 Test Case Generation | AI-generated edge cases with inputs and expected outputs |
| 📜 Review History | Persistent history with load, delete, and score badges |
| ⚡ Redis Caching | SHA-256 keyed 24h cache — identical code served instantly |
| 🔐 JWT Auth | Stateless authentication with 7-day token expiry |
| 📧 OTP Reset | Redis-backed 15-minute OTP via Nodemailer |
| 🛡 Rate Limiting | Redis sliding window — 5 reviews per 15 min per user |
| 📋 Copy Refactored | One-click copy of AI-refactored code |
| 📈 Stats API | Aggregate review stats per user |
| 🖥 VS Code Extension | Full enterprise extension — see below |
| 9 Languages | JS · TS · Python · Java · C++ · C · Go · Rust · C# |
| 🐳 Docker | Full `docker-compose.yml` for one-command local setup |
| 🔄 CI/CD | GitHub Actions — type-check, lint, compile, Docker build |

---

## 🔌 VS Code Extension — Full Feature Set

The extension is a **publishable `.vsix`** that works with any VS Code installation.

| Feature | Details |
|---|---|
| ⚡ CodeLens | "Review with CodeSense AI" lens above every file |
| 🐛 Inline Diagnostics | Issues appear in editor gutter + Problems panel |
| 💡 CodeAction | Lightbulb quick-fix on diagnostic lines |
| 🖱 HoverProvider | Hover over an issue line to see AI details + action links |
| 🌲 TreeView | Review History panel in the activity bar sidebar |
| 🔀 Diff Command | Native VS Code diff: original ↔ AI refactored |
| 📋 Copy Refactored | Copy AI code to clipboard (`Ctrl+Shift+C`) |
| ✅ Apply Refactored | Replace file content with AI version (with confirmation) |
| 💾 Persistent History | Stored in `globalState`, survives VS Code restarts |
| 🚶 Walkthrough | Built-in getting started guide |
| ⚙️ Settings | API URL, auto-review on save, CodeLens toggle, max history |
| 🎯 Smart Errors | Rate limit, auth expiry, connection refused — all handled |

### Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|---|---|---|
| Review current file | `Ctrl+Shift+R` | `Cmd+Shift+R` |
| Review selection | `Ctrl+Shift+S` | `Cmd+Shift+S` |
| Open diff viewer | `Ctrl+Shift+D` | `Cmd+Shift+D` |
| Copy refactored code | `Ctrl+Shift+C` | `Cmd+Shift+C` |

---

## 📁 Project Structure

```
code-review-enterprise/
│
├── 🌐 web/                          # Next.js 14 + TypeScript
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── auth/            # register · login · forgot · reset
│   │   │   │   ├── review/          # POST /api/review
│   │   │   │   ├── history/         # GET · DELETE /api/history
│   │   │   │   └── stats/           # GET /api/stats
│   │   │   ├── layout.tsx · page.tsx · loading.tsx · error.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── auth/                # AuthPage · LoginForm · RegisterForm · ResetPasswordFlow
│   │   │   ├── dashboard/           # Dashboard · Navbar · EditorPanel · ResultsPanel
│   │   │   │   └── tabs/            # MetricsTab · DiffTab · HistoryTab
│   │   │   └── ui/                  # CopyButton
│   │   ├── lib/                     # db · redis · auth · rateLimit · utils
│   │   ├── middleware.ts             # Security headers
│   │   ├── models/                  # User (Mongoose)
│   │   ├── store/                   # Zustand: auth · review
│   │   └── types/
│   ├── Dockerfile
│   └── package.json
│
├── 🐍 ai-service/                   # Python FastAPI Microservice
│   ├── main.py
│   ├── app/
│   │   ├── config.py · database.py · models.py · auth.py
│   │   ├── routers/                 # review · health
│   │   └── services/                # ai_service · cache_service
│   ├── Dockerfile
│   └── requirements.txt
│
├── 🔌 vscode-extension/             # VS Code Extension (TypeScript)
│   ├── src/
│   │   ├── extension.ts             # Activation — registers all providers & commands
│   │   ├── auth/AuthManager.ts      # Token storage via globalState
│   │   ├── review/ReviewManager.ts  # File/selection/diff/apply logic
│   │   ├── diagnostics/             # Inline issue decorations
│   │   ├── providers/
│   │   │   ├── HoverProvider.ts     # Hover tooltips on issue lines
│   │   │   ├── CodeActionProvider.ts# Lightbulb quick-fix actions
│   │   │   └── CodeLensProvider.ts  # Review lens above files
│   │   ├── tree/HistoryTreeProvider.ts  # Sidebar history tree
│   │   ├── ui/StatusBarManager.ts   # Status bar item
│   │   └── panels/ReviewPanelProvider.ts  # Webview sidebar
│   ├── assets/                      # icon-mono.svg · walkthrough/
│   ├── CHANGELOG.md
│   ├── .vscodeignore
│   └── package.json
│
├── 🐳 docker-compose.yml            # One-command local setup
├── 🔄 .github/workflows/ci.yml      # GitHub Actions CI
├── 🚫 .gitignore
└── 📖 README.md
```

---

## 🚀 Getting Started

### Option A — Docker (Recommended)

```bash
git clone https://github.com/your-username/codesense-ai
cd codesense-ai/code-review-enterprise

# Copy and fill in your env vars
cp web/.env.example web/.env.local
cp ai-service/.env.example ai-service/.env

# Start everything
docker-compose up --build
```

App runs at `http://localhost:3000` · AI service at `http://localhost:8000`

---

### Option B — Manual

**1. AI Service**
```bash
cd ai-service
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in values
uvicorn main:app --reload --port 8000
```

**2. Web App**
```bash
cd web
npm install
cp .env.example .env.local   # fill in values
npm run dev   # http://localhost:3000
```

**3. VS Code Extension**
```bash
cd vscode-extension
npm install
npm run compile
# Press F5 in VS Code to launch Extension Development Host
# Or package it:
npm run package   # → codesense-ai-2.0.0.vsix
```

Install the `.vsix`:
```
Ctrl+Shift+P → "Extensions: Install from VSIX..."
```

---

## ⚙️ Environment Variables

### `web/.env.local`
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/
MONGO_DB_NAME=code_reviewer
REDIS_URI=redis://localhost:6379
JWT_SECRET=your_min_32_char_secret_here
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_16_char_app_password
AI_SERVICE_URL=http://localhost:8000
```

### `ai-service/.env`
```env
GROQ_API_KEY=gsk_...
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/
REDIS_URI=redis://localhost:6379
JWT_SECRET=same_secret_as_web
ALLOWED_ORIGINS=["http://localhost:3000"]
DEBUG=true
```

### VS Code Extension Setting
```
CodeSense AI: API URL → https://your-deployed-app.vercel.app
```

---

## 🌐 Deployment & Using with Existing Deployment

> **Can you test with the current deployment link after pushing to GitHub?**
>
> **Yes — here's exactly how:**
>
> 1. Push this repo to GitHub
> 2. Deploy `web/` to **Vercel** (connect repo → set env vars → deploy)
> 3. Deploy `ai-service/` to **Railway** or **Render** (connect repo → set env vars → deploy)
> 4. Set `AI_SERVICE_URL` in Vercel to your Railway/Render URL
> 5. In VS Code extension settings, set `codesense.apiUrl` to your Vercel URL
> 6. The extension will now talk to your live deployed app — no localhost needed

### Vercel (Web)
```bash
cd web
npx vercel --prod
```

### Railway (AI Service)
```bash
# railway.toml is auto-detected from Dockerfile
railway up --service ai-service
```

---

## 🔐 Security Architecture

| Layer | Mechanism |
|---|---|
| Passwords | bcrypt (cost factor 12) |
| Sessions | JWT HS256, 7-day expiry |
| OTP | Redis TTL 900s, single-use, deleted on use |
| Rate Limiting | Redis sliding window — 5 req / 15 min |
| Input Validation | Zod (Next.js) + Pydantic v2 (Python) |
| Security Headers | X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| CORS | Explicit origin allowlist |
| Email Enumeration | Forgot password always returns 200 |
| Service Auth | AI service validates JWT before accepting any request |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Sign in, returns JWT |
| `POST` | `/api/auth/forgot-password` | Send OTP email |
| `POST` | `/api/auth/reset-password` | Validate OTP, update password |

### Review
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/review` | ✅ | Analyze code (rate limited) |
| `GET` | `/api/history` | ✅ | Fetch review history |
| `DELETE` | `/api/history/:id` | ✅ | Delete a review |
| `GET` | `/api/stats` | ✅ | Aggregate user stats |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| Editor | Monaco Editor (same engine as VS Code) |
| State | Zustand with persistence |
| Backend API | Next.js API Routes (TypeScript) |
| AI Service | Python 3.11, FastAPI, Uvicorn |
| AI Model | Groq — LLaMA 3.3 70B Versatile |
| Database | MongoDB Atlas + Mongoose / Motor |
| Cache | Redis (OTP + code review cache) |
| Auth | JWT + bcrypt |
| Email | Nodemailer + Gmail |
| VS Code | Extension API, Webview, Diagnostics, CodeLens, HoverProvider, CodeAction, TreeView |
| Validation | Zod (TS) + Pydantic v2 (Python) |
| DevOps | Docker, docker-compose, GitHub Actions CI |

---

## 👨‍💻 Author

Built with ❤️ by **Aakarsh Saxena**
*B.Tech Information Technology · IIIT Lucknow*

---

## ⭐ Support

If this project helped you, consider leaving a ⭐ on the repository.

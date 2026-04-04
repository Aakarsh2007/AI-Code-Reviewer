"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ResetPasswordFlow from "./ResetPasswordFlow";
import {
  Zap, Shield, GitBranch, Sparkles,
  CheckCircle2, Code2, Brain, Lock
} from "lucide-react";

type View = "login" | "register" | "reset";

const FEATURES = [
  {
    icon: Brain,
    label: "LLaMA 3.3 70B Analysis",
    desc: "Powered by Groq's fastest inference — results in under 3 seconds",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: Shield,
    label: "Security Scanning",
    desc: "Detects OWASP Top 10, injection flaws, and auth vulnerabilities",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: GitBranch,
    label: "9 Languages Supported",
    desc: "JS · TS · Python · Java · C++ · Go · Rust · C# · C",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Zap,
    label: "Redis-Cached Results",
    desc: "SHA-256 keyed 24h cache — identical code served instantly",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
];

const STATS = [
  { value: "< 3s", label: "Avg. analysis time" },
  { value: "9", label: "Languages" },
  { value: "4", label: "Issue categories" },
];

export default function AuthPage() {
  const [view, setView] = useState<View>("login");

  return (
    <div className="min-h-screen bg-background dot-grid flex overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      {/* ── Left panel — Branding ─────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col w-[52%] relative p-12 xl:p-16">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-auto">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center glow-green-sm">
            <Code2 className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="font-bold text-base tracking-tight">CodeSense AI</span>
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
            Enterprise
          </span>
        </div>

        {/* Hero text */}
        <div className="my-12">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full mb-6">
            <div className="status-dot" />
            AI-powered · Production-ready
          </div>

          <h1 className="text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight mb-6">
            Code review
            <br />
            <span className="text-gradient">reimagined</span>
            <br />
            with AI.
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
            Detect bugs, security vulnerabilities, and performance bottlenecks
            before they reach production — in seconds.
          </p>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 mb-10 pb-10 border-b border-border/40">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-black text-gradient">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Feature list */}
        <div className="space-y-3">
          {FEATURES.map(({ icon: Icon, label, desc, color, bg }) => (
            <div key={label} className="flex items-start gap-3 group">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all group-hover:scale-105 ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground/90">{label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-10 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CodeSense AI
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" />
            SOC 2 compliant architecture
          </div>
        </div>
      </div>

      {/* Vertical divider */}
      <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-border/60 to-transparent" />

      {/* ── Right panel — Auth form ───────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-bold text-sm">CodeSense AI</span>
          </div>

          <AnimatePresence mode="wait">
            {view === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <LoginForm onRegister={() => setView("register")} onForgot={() => setView("reset")} />
              </motion.div>
            )}
            {view === "register" && (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <RegisterForm onLogin={() => setView("login")} />
              </motion.div>
            )}
            {view === "reset" && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <ResetPasswordFlow onBack={() => setView("login")} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trust badges */}
          <div className="mt-8 flex items-center justify-center gap-4">
            {["JWT Secured", "bcrypt hashed", "Rate limited"].map((t) => (
              <div key={t} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <CheckCircle2 className="w-3 h-3 text-emerald-500/60" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ResetPasswordFlow from "./ResetPasswordFlow";
import { Code2, Zap, Shield, GitBranch } from "lucide-react";

type View = "login" | "register" | "reset";

export default function AuthPage() {
  const [view, setView] = useState<View>("login");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-background via-muted/30 to-background border-r border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-brand-400" />
          </div>
          <span className="font-semibold text-lg tracking-tight">CodeSense AI</span>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Enterprise-grade<br />
              <span className="text-gradient">AI code review</span><br />
              for serious teams.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Detect bugs, security vulnerabilities, and performance bottlenecks before they reach production.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Zap, label: "Instant analysis", desc: "Results in under 3 seconds with Redis caching" },
              { icon: Shield, label: "Security scanning", desc: "Detects OWASP Top 10 and common vulnerabilities" },
              { icon: GitBranch, label: "9 languages", desc: "JS, TS, Python, Java, C++, Go, Rust and more" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-brand-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">{label}</p>
                  <p className="text-muted-foreground text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} CodeSense AI. All rights reserved.
        </p>
      </div>

      {/* Right — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {view === "login" && (
              <motion.div key="login" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                <LoginForm onRegister={() => setView("register")} onForgot={() => setView("reset")} />
              </motion.div>
            )}
            {view === "register" && (
              <motion.div key="register" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                <RegisterForm onLogin={() => setView("login")} />
              </motion.div>
            )}
            {view === "reset" && (
              <motion.div key="reset" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                <ResetPasswordFlow onBack={() => setView("login")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

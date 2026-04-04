"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onRegister: () => void;
  onForgot: () => void;
}

export default function LoginForm({ onRegister, onForgot }: Props) {
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });
      setAuth(data.token, data.user);
      toast.success("Welcome back!");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-black tracking-tight mb-1.5">Sign in</h2>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your workspace.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
            Email address
          </label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoComplete="email"
              className={cn(
                "w-full pl-10 pr-4 py-3 rounded-xl text-sm",
                "bg-secondary/50 border border-border",
                "focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50",
                "placeholder:text-muted-foreground/50 transition-all"
              )}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
              Password
            </label>
            <button
              type="button"
              onClick={onForgot}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-400 transition-colors" />
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className={cn(
                "w-full pl-10 pr-10 py-3 rounded-xl text-sm",
                "bg-secondary/50 border border-border",
                "focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50",
                "placeholder:text-muted-foreground/50 transition-all"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold",
            "bg-emerald-500 hover:bg-emerald-400 text-emerald-950 transition-all",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-background",
            !loading && "glow-green-sm"
          )}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>Sign in <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button
          onClick={onRegister}
          className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
        >
          Create one free
        </button>
      </p>
    </div>
  );
}

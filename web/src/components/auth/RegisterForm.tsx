"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props { onLogin: () => void; }

export default function RegisterForm({ onLogin }: Props) {
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-emerald-500"][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/register", { email, password });
      setAuth(data.token, data.user);
      toast.success("Account created!");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = cn(
    "w-full py-3 rounded-xl text-sm",
    "bg-secondary/50 border border-border",
    "focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50",
    "placeholder:text-muted-foreground/50 transition-all"
  );

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-black tracking-tight mb-1.5">Create account</h2>
        <p className="text-sm text-muted-foreground">Start reviewing code with AI in seconds.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Email address</label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-400 transition-colors" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com" required autoComplete="email"
              className={cn(inputCls, "pl-10 pr-4")} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Password</label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-400 transition-colors" />
            <input type={showPw ? "text" : "password"} value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters" required autoComplete="new-password"
              className={cn(inputCls, "pl-10 pr-10")} />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Strength bar */}
          {password.length > 0 && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={cn("h-1 flex-1 rounded-full transition-all duration-300",
                    strength >= s ? strengthColor : "bg-border")} />
                ))}
              </div>
              <p className={cn("text-xs font-medium",
                strength === 1 ? "text-red-400" : strength === 2 ? "text-amber-400" : "text-emerald-400")}>
                {strengthLabel}
              </p>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold",
            "bg-emerald-500 hover:bg-emerald-400 text-emerald-950 transition-all",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-background",
            !loading && "glow-green-sm"
          )}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create account <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button onClick={onLogin} className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
          Sign in
        </button>
      </p>
    </div>
  );
}

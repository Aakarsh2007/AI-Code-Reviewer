"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Mail, KeyRound, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props { onBack: () => void; }

export default function ResetPasswordFlow({ onBack }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/forgot-password", { email });
      toast.success("Verification code sent!");
      setStep(2);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Failed to send OTP");
    } finally { setLoading(false); }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/reset-password", { email, otp, password });
      setStep(3);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Invalid or expired OTP");
    } finally { setLoading(false); }
  };

  const inputCls = cn("w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground transition-all");
  const btnCls = cn("w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed");

  if (step === 3) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-500/15 border border-brand-500/30 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-brand-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Password reset</h2>
          <p className="text-muted-foreground text-sm">Your password has been updated successfully.</p>
        </div>
        <button onClick={onBack} className={btnCls}>Back to sign in</button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to sign in
      </button>

      <div>
        <h2 className="text-2xl font-bold mb-1">Reset password</h2>
        <p className="text-muted-foreground text-sm">
          {step === 1 ? "Enter your email to receive a verification code." : `Code sent to ${email}`}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={sendOtp} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground/80">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required className={inputCls} />
            </div>
          </div>
          <button type="submit" disabled={loading} className={btnCls}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send verification code"}
          </button>
        </form>
      ) : (
        <form onSubmit={resetPassword} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground/80">6-digit code</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="000000" maxLength={6} required
                className={cn(inputCls, "tracking-[0.5em] text-center font-mono")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground/80">New password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" required className={inputCls} />
            </div>
          </div>
          <button type="submit" disabled={loading} className={btnCls}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm reset"}
          </button>
        </form>
      )}
    </div>
  );
}

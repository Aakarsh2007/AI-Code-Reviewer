"use client";

import { useAuthStore } from "@/store/auth";
import { useReviewStore } from "@/store/review";
import { Code2, LogOut, User, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { reset } = useReviewStore();

  const handleLogout = () => {
    logout();
    reset();
    toast.success("Signed out successfully");
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border/50 bg-card/40 backdrop-blur-sm flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-md bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
          <Code2 className="w-4 h-4 text-brand-400" />
        </div>
        <span className="font-semibold text-sm tracking-tight">CodeSense AI</span>
        <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/50">
          <Zap className="w-3 h-3 text-brand-400" /> Enterprise
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-3.5 h-3.5" />
          <span className="text-xs">{user?.email}</span>
        </div>
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md",
            "text-muted-foreground hover:text-foreground hover:bg-muted",
            "border border-transparent hover:border-border/50 transition-all"
          )}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}

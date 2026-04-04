"use client";

import { useAuthStore } from "@/store/auth";
import { useReviewStore } from "@/store/review";
import { Code2, LogOut, ChevronDown, Zap, Download } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { reset } = useReviewStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    reset();
    toast.success("Signed out");
    setMenuOpen(false);
  };

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <header className="h-12 flex items-center justify-between px-4 border-b border-border/60 bg-card/50 backdrop-blur-md flex-shrink-0 relative z-20">
      {/* Left — Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <span className="font-bold text-sm tracking-tight">CodeSense AI</span>
        <div className="hidden sm:flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
          <Zap className="w-2.5 h-2.5" /> Enterprise
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">
        {/* VS Code extension download hint */}
        <a
          href="https://marketplace.visualstudio.com/items?itemName=codesense-ai.codesense-ai"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "hidden md:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg",
            "text-muted-foreground hover:text-foreground",
            "bg-secondary/50 border border-border/50 hover:border-border",
            "transition-all"
          )}
        >
          <Download className="w-3 h-3" />
          VS Code Extension
        </a>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={cn(
              "flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg",
              "bg-secondary/50 border border-border/50 hover:border-border",
              "transition-all text-sm"
            )}
          >
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-400">
              {initials}
            </div>
            <span className="hidden sm:block text-xs text-muted-foreground max-w-[120px] truncate">
              {user?.email}
            </span>
            <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform", menuOpen && "rotate-180")} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-52 z-20 bg-card border border-border rounded-xl shadow-2xl shadow-black/40 overflow-hidden animate-fade-in">
                <div className="px-3 py-2.5 border-b border-border/60">
                  <p className="text-xs font-semibold text-foreground truncate">{user?.email}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Free plan</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

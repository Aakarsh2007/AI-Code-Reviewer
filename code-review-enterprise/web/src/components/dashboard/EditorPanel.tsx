"use client";

import dynamic from "next/dynamic";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth";
import { useReviewStore } from "@/store/review";
import { LANGUAGES } from "@/types";
import { cn } from "@/lib/utils";
import { Play, Plus, ChevronDown, Loader2, Cpu } from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react").then((m) => m.Editor), { ssr: false });

export default function EditorPanel() {
  const { token } = useAuthStore();
  const { code, language, isLoading, setCode, setLanguage, setReview, setLoading, reset } = useReviewStore();

  const reviewCode = async () => {
    if (!code.trim()) { toast.error("Please enter some code to review"); return; }
    setLoading(true);
    setReview(null);
    try {
      const { data } = await axios.post(
        "/api/review",
        { code, language },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReview(data);
      toast.success(data.cached ? "⚡ Served from cache" : "Analysis complete");
    } catch (err: any) {
      if (err.response?.status === 429) {
        toast.error("Rate limit reached. Try again in 15 minutes.");
      } else if (err.response?.status === 401) {
        toast.error("Session expired. Please sign in again.");
      } else {
        toast.error(err.response?.data?.message ?? "Analysis failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-1/2 border-r border-border/50 min-w-0">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-card/30 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Editor</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={cn(
                "appearance-none text-xs font-medium pl-3 pr-7 py-1.5 rounded-md",
                "bg-muted border border-border/50 text-foreground",
                "focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
              )}
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-muted border border-border/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
          >
            <Plus className="w-3 h-3" /> New
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          height="100%"
          language={language === "csharp" ? "csharp" : language}
          theme="vs-dark"
          value={code}
          onChange={(v) => setCode(v ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "var(--font-jetbrains), Menlo, monospace",
            fontLigatures: true,
            lineHeight: 1.7,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            renderLineHighlight: "gutter",
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            formatOnPaste: true,
            tabSize: 2,
          }}
        />
      </div>

      {/* Review button */}
      <div className="p-3 border-t border-border/50 bg-card/30 flex-shrink-0">
        <button
          onClick={reviewCode}
          disabled={isLoading}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold",
            "bg-brand-500 hover:bg-brand-600 text-white transition-all",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
            !isLoading && "glow-green"
          )}
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
          ) : (
            <><Play className="w-4 h-4" /> Review Code</>
          )}
        </button>
      </div>
    </div>
  );
}

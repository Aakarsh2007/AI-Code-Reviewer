"use client";

import dynamic from "next/dynamic";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth";
import { useReviewStore } from "@/store/review";
import { LANGUAGES } from "@/types";
import { cn } from "@/lib/utils";
import { Play, Plus, ChevronDown, Loader2, FileCode2, Sparkles } from "lucide-react";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.Editor),
  { ssr: false, loading: () => <EditorSkeleton /> }
);

function EditorSkeleton() {
  return (
    <div className="h-full bg-[#1e1e1e] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground/40">
        <FileCode2 className="w-8 h-8" />
        <p className="text-xs">Loading editor...</p>
      </div>
    </div>
  );
}

export default function EditorPanel() {
  const { token } = useAuthStore();
  const { code, language, isLoading, setCode, setLanguage, setReview, setLoading, reset } = useReviewStore();

  const reviewCode = async () => {
    if (!code.trim() || code.trim() === "// Paste your code here...") {
      toast.error("Please enter some code to review");
      return;
    }
    setLoading(true);
    setReview(null);
    try {
      const { data } = await axios.post(
        "/api/review",
        { code, language },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReview(data);
      toast.success(data.cached ? "⚡ Served from cache" : "✅ Analysis complete");
    } catch (err: any) {
      if (err.response?.status === 429) {
        toast.error("Rate limit reached. Try again in 15 minutes.");
      } else if (err.response?.status === 401) {
        toast.error("Session expired. Please sign in again.");
      } else {
        toast.error(err.response?.data?.message ?? "Analysis failed. Check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const lineCount = code.split("\n").length;
  const charCount = code.length;

  return (
    <div className="flex flex-col w-[50%] min-w-[320px] border-r border-border/60 bg-[#0d1117]">
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 h-10 border-b border-border/60 bg-card/40 flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <div className="w-px h-3.5 bg-border/60 mx-1" />
          <FileCode2 className="w-3.5 h-3.5 text-muted-foreground/60" />
          <span className="text-xs text-muted-foreground/70 font-mono">
            untitled.{language === "typescript" ? "ts" : language === "javascript" ? "js" : language === "python" ? "py" : language}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Language selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={cn(
                "appearance-none text-xs font-medium pl-2.5 pr-6 py-1 rounded-md",
                "bg-secondary/60 border border-border/60 text-foreground/80",
                "focus:outline-none focus:ring-1 focus:ring-emerald-500/40 cursor-pointer",
                "hover:border-border transition-all"
              )}
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>

          <button
            onClick={reset}
            className={cn(
              "flex items-center gap-1 text-xs px-2 py-1 rounded-md",
              "bg-secondary/60 border border-border/60 hover:border-border",
              "text-muted-foreground hover:text-foreground transition-all"
            )}
          >
            <Plus className="w-3 h-3" /> New
          </button>
        </div>
      </div>

      {/* ── Monaco Editor ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(v) => setCode(v ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
            fontLigatures: true,
            lineHeight: 1.75,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            renderLineHighlight: "gutter",
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            formatOnPaste: true,
            tabSize: 2,
            wordWrap: "off",
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true, indentation: true },
            renderWhitespace: "none",
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              verticalScrollbarSize: 5,
              horizontalScrollbarSize: 5,
            },
          }}
        />
      </div>

      {/* ── Status bar + Review button ───────────────────────────────────── */}
      <div className="border-t border-border/60 bg-card/40 flex-shrink-0">
        {/* Status bar */}
        <div className="flex items-center justify-between px-3 py-1 border-b border-border/40">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground/50 font-mono">
            <span>{lineCount} lines</span>
            <span>{charCount} chars</span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
            Ready
          </div>
        </div>

        {/* Review button */}
        <div className="p-2.5">
          <button
            onClick={reviewCode}
            disabled={isLoading}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold",
              "bg-emerald-500 hover:bg-emerald-400 text-emerald-950",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-background",
              "transition-all duration-200",
              !isLoading && "glow-green-sm"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Review Code</span>
                <Play className="w-3.5 h-3.5 ml-0.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

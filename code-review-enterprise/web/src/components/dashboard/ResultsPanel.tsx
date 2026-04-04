"use client";

import { cn } from "@/lib/utils";
import { useReviewStore } from "@/store/review";
import MetricsTab from "./tabs/MetricsTab";
import DiffTab from "./tabs/DiffTab";
import HistoryTab from "./tabs/HistoryTab";
import { BarChart3, GitCompare, History, Loader2, Brain } from "lucide-react";

type Tab = "metrics" | "diff" | "history";

interface Props {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
}

const TABS = [
  { id: "metrics" as Tab, label: "Analysis", icon: BarChart3 },
  { id: "diff" as Tab, label: "Diff", icon: GitCompare },
  { id: "history" as Tab, label: "History", icon: History },
];

export default function ResultsPanel({ activeTab, setActiveTab }: Props) {
  const { isLoading, review } = useReviewStore();

  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-background">
      {/* ── Tab bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 px-3 h-10 border-b border-border/60 bg-card/40 flex-shrink-0">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all",
              activeTab === id
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            {id === "metrics" && review && (
              <span className={cn(
                "text-[9px] font-bold px-1.5 py-0.5 rounded-full border",
                review.code_quality_score >= 8
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : review.code_quality_score >= 5
                  ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                  : "bg-red-500/15 text-red-400 border-red-500/30"
              )}>
                {review.code_quality_score}/10
              </span>
            )}
          </button>
        ))}

        {/* Right side — AI model badge */}
        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
          <Brain className="w-3 h-3" />
          <span className="hidden sm:inline">LLaMA 3.3 70B</span>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden relative">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm gap-5">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Brain className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="absolute -inset-1 rounded-2xl border border-emerald-500/20 animate-ping opacity-30" />
            </div>
            <div className="text-center space-y-1.5">
              <p className="text-sm font-semibold">Analyzing your code</p>
              <p className="text-xs text-muted-foreground">Running LLaMA 3.3 70B analysis pipeline...</p>
            </div>
            <div className="flex items-center gap-1.5">
              {["Parsing AST", "Detecting issues", "Generating fixes"].map((step, i) => (
                <div key={step} className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 text-emerald-400/60 animate-spin" style={{ animationDelay: `${i * 0.2}s` }} />
                  <span className="text-[10px] text-muted-foreground/60">{step}</span>
                  {i < 2 && <span className="text-muted-foreground/30 mx-1">·</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "metrics" && <MetricsTab />}
        {activeTab === "diff" && <DiffTab />}
        {activeTab === "history" && <HistoryTab />}
      </div>
    </div>
  );
}

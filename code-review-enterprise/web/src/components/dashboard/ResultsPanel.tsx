"use client";

import { cn } from "@/lib/utils";
import { useReviewStore } from "@/store/review";
import MetricsTab from "./tabs/MetricsTab";
import DiffTab from "./tabs/DiffTab";
import HistoryTab from "./tabs/HistoryTab";
import { BarChart3, GitCompare, History, Loader2 } from "lucide-react";

type Tab = "metrics" | "diff" | "history";

interface Props {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
}

const TABS = [
  { id: "metrics" as Tab, label: "Analysis", icon: BarChart3 },
  { id: "diff" as Tab, label: "Diff Viewer", icon: GitCompare },
  { id: "history" as Tab, label: "History", icon: History },
];

export default function ResultsPanel({ activeTab, setActiveTab }: Props) {
  const { isLoading } = useReviewStore();

  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border/50 bg-card/30 flex-shrink-0">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-all",
              activeTab === id
                ? "bg-brand-500/15 text-brand-400 border border-brand-500/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Analyzing your code...</p>
              <p className="text-xs text-muted-foreground mt-1">Running AI analysis pipeline</p>
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

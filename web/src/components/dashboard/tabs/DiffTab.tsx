"use client";

import dynamic from "next/dynamic";
import { useReviewStore } from "@/store/review";
import { GitCompare } from "lucide-react";

const DiffEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.DiffEditor),
  { ssr: false }
);

export default function DiffTab() {
  const { review, code, language } = useReviewStore();

  if (!review) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-muted border border-border/50 flex items-center justify-center">
          <GitCompare className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">No diff available</h3>
          <p className="text-muted-foreground text-sm">Submit code for review to see the AI refactored diff.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-card/20 flex-shrink-0">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400/70" /> Original</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-400/70" /> AI Refactored</span>
        </div>
      </div>
      <div className="flex-1">
        <DiffEditor
          height="100%"
          language={language}
          theme="vs-dark"
          original={code}
          modified={review.refactored_code}
          options={{
            minimap: { enabled: false },
            readOnly: true,
            renderSideBySide: true,
            fontSize: 12,
            fontFamily: "var(--font-jetbrains), Menlo, monospace",
            fontLigatures: true,
            lineHeight: 1.7,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );
}

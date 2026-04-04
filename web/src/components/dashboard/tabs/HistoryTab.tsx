"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth";
import { useReviewStore } from "@/store/review";
import type { HistoryItem } from "@/types";
import { cn, formatDate, scoreBg, scoreColor } from "@/lib/utils";
import { History, Trash2, RefreshCw, Loader2, Clock, ArrowUpRight } from "lucide-react";

export default function HistoryTab() {
  const { token } = useAuthStore();
  const { setCode, setLanguage, setReview } = useReviewStore();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(data);
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const loadReview = (item: HistoryItem) => {
    setCode(item.original_code);
    setLanguage(item.language);
    setReview(item.ai_response);
    toast.success("Review loaded into editor");
  };

  const deleteReview = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await axios.delete(`/api/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory((prev) => prev.filter((h) => h.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full gap-3">
        <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
        <span className="text-xs text-muted-foreground">Loading history...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60 flex-shrink-0 bg-card/20">
        <div className="flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-muted-foreground/70" />
          <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Review History</span>
          <span className="text-[10px] bg-secondary/60 border border-border/50 px-1.5 py-0.5 rounded-full text-muted-foreground font-semibold">
            {history.length}
          </span>
        </div>
        <button
          onClick={fetchHistory}
          className="p-1.5 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-all"
          title="Refresh"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-secondary/40 border border-border/40 flex items-center justify-center">
              <Clock className="w-6 h-6 text-muted-foreground/30" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground/60">No reviews yet</p>
              <p className="text-xs text-muted-foreground mt-1">Submit your first code review to see history here.</p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {history.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ delay: i * 0.025, duration: 0.2 }}
                onClick={() => loadReview(item)}
                className={cn(
                  "group relative p-3 rounded-xl border cursor-pointer transition-all",
                  "bg-card/30 border-border/40",
                  "hover:bg-card/70 hover:border-border/80 hover:shadow-lg hover:shadow-black/20"
                )}
              >
                {/* Top row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md uppercase tracking-widest flex-shrink-0">
                      {item.language}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 truncate">
                      {formatDate(item.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-md border",
                      scoreBg(item.ai_response.code_quality_score)
                    )}>
                      {item.ai_response.code_quality_score}/10
                    </span>
                    <button
                      onClick={(e) => deleteReview(item.id, e)}
                      disabled={deletingId === item.id}
                      className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-500/15 hover:text-red-400 text-muted-foreground transition-all"
                    >
                      {deletingId === item.id
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : <Trash2 className="w-3 h-3" />
                      }
                    </button>
                    <ArrowUpRight className="w-3 h-3 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>

                {/* Issue summary */}
                <div className="flex items-center gap-2 mb-2">
                  {item.ai_response.issues.length > 0 ? (
                    <span className="text-[10px] text-muted-foreground/60">
                      {item.ai_response.issues.length} issue{item.ai_response.issues.length !== 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-400/70">✓ No issues</span>
                  )}
                  <span className="text-muted-foreground/30">·</span>
                  <span className="text-[10px] text-muted-foreground/60 font-mono">
                    {item.ai_response.time_complexity}
                  </span>
                </div>

                {/* Code preview */}
                <pre className="text-[10px] text-muted-foreground/40 font-mono truncate overflow-hidden leading-relaxed">
                  {item.original_code.slice(0, 100).replace(/\n/g, " ↵ ")}...
                </pre>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

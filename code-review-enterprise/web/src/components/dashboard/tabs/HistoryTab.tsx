"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth";
import { useReviewStore } from "@/store/review";
import type { HistoryItem } from "@/types";
import { cn, formatDate, scoreBg } from "@/lib/utils";
import { History, Trash2, RefreshCw, Loader2, Clock } from "lucide-react";

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
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full gap-3">
        <Loader2 className="w-5 h-5 text-brand-400 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading history...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Review History</span>
          <span className="text-xs bg-muted border border-border/50 px-1.5 py-0.5 rounded-full text-muted-foreground">{history.length}</span>
        </div>
        <button onClick={fetchHistory} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <Clock className="w-10 h-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No reviews yet. Submit your first code review.</p>
          </div>
        ) : (
          <AnimatePresence>
            {history.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => loadReview(item)}
                className={cn(
                  "group relative p-3 rounded-xl border border-border/50 bg-card/40",
                  "hover:bg-card/80 hover:border-border cursor-pointer transition-all"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-mono font-semibold text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded uppercase flex-shrink-0">
                      {item.language}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">{formatDate(item.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={cn("text-xs px-2 py-0.5 rounded border font-medium", scoreBg(item.ai_response.code_quality_score))}>
                      {item.ai_response.code_quality_score}/10
                    </span>
                    <button
                      onClick={(e) => deleteReview(item.id, e)}
                      disabled={deletingId === item.id}
                      className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive text-muted-foreground transition-all"
                    >
                      {deletingId === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <pre className="text-xs text-muted-foreground font-mono truncate overflow-hidden">
                  {item.original_code.slice(0, 120)}...
                </pre>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

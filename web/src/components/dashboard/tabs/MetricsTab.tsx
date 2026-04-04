"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useReviewStore } from "@/store/review";
import { cn, scoreColor, scoreBg, severityColor, issueTypeIcon } from "@/lib/utils";
import {
  Sparkles, Clock, Database, AlertTriangle,
  Lightbulb, FlaskConical, Zap, TrendingUp, CheckCircle2
} from "lucide-react";
import CopyButton from "@/components/ui/CopyButton";

export default function MetricsTab() {
  const { review } = useReviewStore();

  if (!review) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 text-center p-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/8 border border-emerald-500/15 flex items-center justify-center">
            <Sparkles className="w-9 h-9 text-emerald-400/40" />
          </div>
          <div className="absolute -inset-2 rounded-3xl border border-emerald-500/8 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-base">Ready to analyze</h3>
          <p className="text-muted-foreground text-sm max-w-[260px] leading-relaxed">
            Paste your code in the editor and click{" "}
            <span className="text-emerald-400 font-semibold">Review Code</span>{" "}
            to get AI-powered insights.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {["Bug detection", "Security scan", "Complexity", "Test cases"].map((f) => (
            <span key={f} className="text-[10px] text-muted-foreground/60 bg-secondary/40 border border-border/40 px-2.5 py-1 rounded-full">
              {f}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const issuesBySeverity = {
    critical: review.issues.filter((i) => i.severity === "critical").length,
    high: review.issues.filter((i) => i.severity === "high").length,
    medium: review.issues.filter((i) => i.severity === "medium").length,
    low: review.issues.filter((i) => i.severity === "low").length,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="h-full overflow-y-auto"
      >
        <div className="p-4 space-y-5">
          {/* ── Score + Metrics ─────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-2.5">
            <ScoreCard score={review.code_quality_score} />
            <MetricCard label="Time" value={review.time_complexity} icon={Clock} sub="complexity" />
            <MetricCard label="Space" value={review.space_complexity} icon={Database} sub="complexity" />
          </div>

          {/* ── Cache / Copy row ─────────────────────────────────────────── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {review.cached ? (
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
                  <Zap className="w-3 h-3" /> Cached result
                  {review.analysis_duration_ms && (
                    <span className="text-muted-foreground ml-0.5">· {review.analysis_duration_ms.toFixed(0)}ms</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                  <TrendingUp className="w-3 h-3" />
                  Fresh analysis
                  {review.analysis_duration_ms && (
                    <span>· {review.analysis_duration_ms.toFixed(0)}ms</span>
                  )}
                </div>
              )}
            </div>
            {review.refactored_code && (
              <CopyButton text={review.refactored_code} label="Copy refactored" />
            )}
          </div>

          {/* ── Issue severity summary ───────────────────────────────────── */}
          {review.issues.length > 0 && (
            <div className="grid grid-cols-4 gap-1.5">
              {(["critical", "high", "medium", "low"] as const).map((sev) => (
                <div key={sev} className={cn(
                  "rounded-lg p-2 text-center border",
                  sev === "critical" ? "bg-red-500/8 border-red-500/20" :
                  sev === "high" ? "bg-orange-500/8 border-orange-500/20" :
                  sev === "medium" ? "bg-amber-500/8 border-amber-500/20" :
                  "bg-blue-500/8 border-blue-500/20"
                )}>
                  <p className={cn("text-base font-black",
                    sev === "critical" ? "text-red-400" :
                    sev === "high" ? "text-orange-400" :
                    sev === "medium" ? "text-amber-400" : "text-blue-400"
                  )}>
                    {issuesBySeverity[sev]}
                  </p>
                  <p className="text-[9px] text-muted-foreground capitalize mt-0.5">{sev}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Issues ──────────────────────────────────────────────────── */}
          {review.issues.length > 0 ? (
            <Section title="Detected Issues" icon={AlertTriangle} count={review.issues.length}>
              <div className="space-y-2">
                {review.issues.map((issue, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                    className={cn(
                      "flex gap-3 p-3 rounded-xl border text-sm",
                      severityColor(issue.severity)
                    )}
                  >
                    <span className="text-base flex-shrink-0 mt-0.5">{issueTypeIcon(issue.type)}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold uppercase text-[10px] tracking-widest">{issue.type}</span>
                        <span className="text-[10px] opacity-60 font-mono">line {issue.line}</span>
                        <span className={cn(
                          "text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wide",
                          severityColor(issue.severity)
                        )}>
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed opacity-85">{issue.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Section>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-400">No issues detected</p>
                <p className="text-xs text-muted-foreground">Your code looks clean!</p>
              </div>
            </div>
          )}

          {/* ── Suggestions ─────────────────────────────────────────────── */}
          {review.suggestions.length > 0 && (
            <Section title="Suggestions" icon={Lightbulb} count={review.suggestions.length}>
              <ul className="space-y-2">
                {review.suggestions.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                    className="flex gap-3 text-xs text-foreground/80 bg-secondary/40 rounded-xl p-3 border border-border/40 leading-relaxed"
                  >
                    <span className="text-emerald-400 font-black flex-shrink-0 mt-0.5">→</span>
                    {s}
                  </motion.li>
                ))}
              </ul>
            </Section>
          )}

          {/* ── Test cases ──────────────────────────────────────────────── */}
          {review.test_cases.length > 0 && (
            <Section title="AI-Generated Test Cases" icon={FlaskConical} count={review.test_cases.length}>
              <div className="space-y-2.5">
                {review.test_cases.map((tc, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                    className="bg-secondary/30 rounded-xl p-3 border border-border/40 space-y-2"
                  >
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider w-16 flex-shrink-0">Input</span>
                      <code className="font-mono text-[11px] bg-background/60 px-2 py-0.5 rounded-md border border-border/40 text-emerald-300 break-all">{tc.input}</code>
                    </div>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider w-16 flex-shrink-0">Expected</span>
                      <code className="font-mono text-[11px] bg-background/60 px-2 py-0.5 rounded-md border border-border/40 text-green-300 break-all">{tc.expected_output}</code>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed pl-[4.5rem]">{tc.explanation}</p>
                  </motion.div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ScoreCard({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  const color = score >= 8 ? "#22c55e" : score >= 5 ? "#f59e0b" : "#ef4444";
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="bg-card/60 border border-border/50 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 col-span-1">
      <div className="relative w-14 h-14">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r={r} fill="none" stroke="hsl(216 34% 13%)" strokeWidth="4" />
          <circle
            cx="24" cy="24" r={r} fill="none"
            stroke={color} strokeWidth="4"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.16,1,0.3,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("text-sm font-black", scoreColor(score))}>{score}</span>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground text-center leading-tight">Quality<br />Score</p>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, sub }: {
  label: string; value: string; icon: React.ElementType; sub?: string;
}) {
  return (
    <div className="bg-card/60 border border-border/50 rounded-xl p-3 space-y-1.5">
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <Icon className="w-3 h-3" /> {label}
      </div>
      <p className="font-black text-sm font-mono text-foreground leading-tight">{value}</p>
      {sub && <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider">{sub}</p>}
    </div>
  );
}

function Section({ title, icon: Icon, count, children }: {
  title: string; icon: React.ElementType; count: number; children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-muted-foreground/70" />
        <h3 className="text-xs font-bold text-foreground/80 uppercase tracking-wider">{title}</h3>
        <span className="text-[10px] bg-secondary/60 border border-border/50 px-1.5 py-0.5 rounded-full text-muted-foreground font-semibold">
          {count}
        </span>
      </div>
      {children}
    </div>
  );
}

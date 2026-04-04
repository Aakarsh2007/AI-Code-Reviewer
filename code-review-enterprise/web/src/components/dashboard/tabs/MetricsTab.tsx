"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useReviewStore } from "@/store/review";
import { cn, scoreColor, scoreBg, severityColor, issueTypeIcon } from "@/lib/utils";
import { Sparkles, Clock, Database, AlertTriangle, Lightbulb, FlaskConical, Zap } from "lucide-react";
import CopyButton from "@/components/ui/CopyButton";

export default function MetricsTab() {
  const { review } = useReviewStore();

  if (!review) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-brand-400/60" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">Ready to analyze</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Paste your code in the editor and click Review Code to get AI-powered insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full overflow-y-auto p-4 space-y-4"
      >
        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-3">
          <MetricCard
            label="Quality Score"
            value={`${review.code_quality_score}/10`}
            icon={Sparkles}
            valueClass={scoreColor(review.code_quality_score)}
            badge={scoreBg(review.code_quality_score)}
          />
          <MetricCard label="Time Complexity" value={review.time_complexity} icon={Clock} />
          <MetricCard label="Space Complexity" value={review.space_complexity} icon={Database} />
        </div>

        {/* Cache badge */}
        {review.cached && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-brand-400 bg-brand-500/10 border border-brand-500/20 rounded-md px-3 py-1.5 w-fit">
              <Zap className="w-3 h-3" /> Served from cache
              {review.analysis_duration_ms && <span className="text-muted-foreground ml-1">({review.analysis_duration_ms.toFixed(0)}ms)</span>}
            </div>
            <CopyButton text={review.refactored_code} label="Copy refactored" />
          </div>
        )}
        {!review.cached && review.refactored_code && (
          <div className="flex justify-end">
            <CopyButton text={review.refactored_code} label="Copy refactored" />
          </div>
        )}

        {/* Issues */}
        {review.issues.length > 0 && (
          <Section title="Detected Issues" icon={AlertTriangle} count={review.issues.length}>
            <div className="space-y-2">
              {review.issues.map((issue, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn("flex gap-3 p-3 rounded-lg border text-sm", severityColor(issue.severity))}
                >
                  <span className="text-base flex-shrink-0">{issueTypeIcon(issue.type)}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium uppercase text-xs tracking-wide">{issue.type}</span>
                      <span className="text-xs opacity-70">Line {issue.line}</span>
                      <span className={cn("text-xs px-1.5 py-0.5 rounded border", severityColor(issue.severity))}>{issue.severity}</span>
                    </div>
                    <p className="opacity-90 leading-relaxed">{issue.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>
        )}

        {/* Suggestions */}
        {review.suggestions.length > 0 && (
          <Section title="Suggestions" icon={Lightbulb} count={review.suggestions.length}>
            <ul className="space-y-2">
              {review.suggestions.map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex gap-2.5 text-sm text-foreground/80 bg-muted/50 rounded-lg p-3 border border-border/50"
                >
                  <span className="text-brand-400 font-bold flex-shrink-0">→</span>
                  {s}
                </motion.li>
              ))}
            </ul>
          </Section>
        )}

        {/* Test cases */}
        {review.test_cases.length > 0 && (
          <Section title="AI-Generated Test Cases" icon={FlaskConical} count={review.test_cases.length}>
            <div className="space-y-3">
              {review.test_cases.map((tc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-muted/50 rounded-lg p-3 border border-border/50 space-y-2 text-sm"
                >
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-20 flex-shrink-0">Input</span>
                    <code className="font-mono text-xs bg-background px-2 py-0.5 rounded border border-border/50 text-brand-300">{tc.input}</code>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-20 flex-shrink-0">Expected</span>
                    <code className="font-mono text-xs bg-background px-2 py-0.5 rounded border border-border/50 text-green-300">{tc.expected_output}</code>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{tc.explanation}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function MetricCard({ label, value, icon: Icon, valueClass, badge }: {
  label: string; value: string; icon: React.ElementType;
  valueClass?: string; badge?: string;
}) {
  return (
    <div className="bg-card/60 border border-border/50 rounded-xl p-3 space-y-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <p className={cn("font-bold text-lg font-mono", valueClass ?? "text-foreground")}>{value}</p>
    </div>
  );
}

function Section({ title, icon: Icon, count, children }: {
  title: string; icon: React.ElementType; count: number; children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-xs bg-muted border border-border/50 px-1.5 py-0.5 rounded-full text-muted-foreground">{count}</span>
      </div>
      {children}
    </div>
  );
}

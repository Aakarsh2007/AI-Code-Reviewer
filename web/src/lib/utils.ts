import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function scoreColor(score: number): string {
  if (score >= 8) return "text-brand-400";
  if (score >= 5) return "text-yellow-400";
  return "text-red-400";
}

export function scoreBg(score: number): string {
  if (score >= 8) return "bg-brand-500/15 text-brand-400 border-brand-500/30";
  if (score >= 5) return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
  return "bg-red-500/15 text-red-400 border-red-500/30";
}

export function severityColor(severity: string): string {
  const map: Record<string, string> = {
    critical: "text-red-400 bg-red-500/10 border-red-500/30",
    high: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    low: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  };
  return map[severity] ?? map.medium;
}

export function issueTypeIcon(type: string): string {
  const map: Record<string, string> = {
    bug: "🐛",
    performance: "⚡",
    style: "🎨",
    security: "🔒",
  };
  return map[type] ?? "⚠️";
}

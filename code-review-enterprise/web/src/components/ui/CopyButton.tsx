"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  text: string;
  className?: string;
  label?: string;
}

export default function CopyButton({ text, className, label }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className={cn(
        "flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md transition-all",
        "border border-border/50 bg-muted hover:bg-secondary",
        copied
          ? "text-brand-400 border-brand-500/30"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {label && <span>{copied ? "Copied!" : label}</span>}
    </button>
  );
}

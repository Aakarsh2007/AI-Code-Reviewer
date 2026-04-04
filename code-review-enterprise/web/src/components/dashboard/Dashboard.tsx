"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import EditorPanel from "./EditorPanel";
import ResultsPanel from "./ResultsPanel";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"metrics" | "diff" | "history">("metrics");

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-1 overflow-hidden"
      >
        <EditorPanel />
        <ResultsPanel activeTab={activeTab} setActiveTab={setActiveTab} />
      </motion.main>
    </div>
  );
}

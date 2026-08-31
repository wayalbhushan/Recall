"use client";

import { useState } from "react";
import GenerationControls from "./GenerationControls";

export default function TopicInput({ topic, setTopic, status, onGenerate, onReset }) {
  const [controls, setControls] = useState({ mode: "quiz", count: 5, difficulty: "medium", style: "mixed", instructions: "" });
  const trimmed = topic.trim();
  const isValid = trimmed.length >= 3;
  const isLoading = status === "loading";
  const isReady = status === "ready";

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      if (isValid && !isLoading) {
        onGenerate(controls);
      }
    }
  };

  return (
    <div className="flex flex-col gap-[12px] w-full bg-[var(--card)] p-[24px] border border-[var(--rule)] rounded-[4px]">
      <label htmlFor="topic-input" className="text-[16px] text-[var(--ink)] font-medium">
        Topic or notes
      </label>
      <textarea
        id="topic-input"
        rows={4}
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        placeholder="e.g. The stages of cellular respiration..."
        className="w-full min-h-[120px] resize-y p-[12px] border border-[var(--rule)] rounded-[4px] text-[16px] text-[var(--ink)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--ink-soft)] disabled:opacity-60"
      />
      
      <div className="mt-[4px]">
        <GenerationControls 
          value={controls} 
          onChange={setControls} 
          disabled={isLoading} 
        />
      </div>

      <div className="flex items-center justify-between mt-[16px] border-t border-[var(--rule)] pt-[16px]">
        <span 
          style={{ fontFamily: "var(--font-ibm-plex-mono)" }} 
          className="text-[12px] text-[var(--ink-soft)]"
        >
          {topic.length} / 4000
        </span>
        <div className="flex items-center gap-[16px]">
          {isReady && (
            <button
              onClick={onReset}
              className="text-[16px] text-[var(--ink-soft)] hover:text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] rounded-[4px] px-[8px] py-[4px]"
            >
              Start over
            </button>
          )}
          <button
            onClick={() => onGenerate(controls)}
            disabled={!isValid || isLoading}
            className="px-[32px] py-[12px] bg-[var(--primary)] text-[var(--card)] rounded-[4px] text-[16px] font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-sm hover:scale-[1.02] transition-transform"
          >
            {isLoading ? "Generating" : controls.mode === "both" ? "Generate both" : controls.mode === "flashcards" ? "Generate flashcards" : "Generate quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}

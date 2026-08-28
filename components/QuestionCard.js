"use client";

import { useEffect } from "react";

const LETTERS = ["A", "B", "C", "D"];

export default function QuestionCard({ question, selectedIndex, onSelect }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
      const key = e.key;
      if (["1", "2", "3", "4"].includes(key)) {
        onSelect(parseInt(key, 10) - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSelect]);

  return (
    <div className="flex flex-col gap-[24px]">
      <h2 
        style={{ fontFamily: "var(--font-ibm-plex-sans)" }}
        className="text-[20px] text-[var(--ink)] leading-[1.6]"
      >
        {question.prompt}
      </h2>
      <div className="flex flex-col gap-[12px]">
        {question.options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              aria-pressed={isSelected}
              className={`group flex items-center gap-[12px] w-full p-[16px] text-left border rounded-[4px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] transition-colors ${
                isSelected
                  ? "border-[var(--primary)] bg-[var(--card)]"
                  : "border-[var(--rule)] bg-[var(--card)] hover:border-[var(--ink-soft)]"
              }`}
            >
              <div 
                style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
                className={`flex shrink-0 items-center justify-center w-[24px] h-[24px] rounded-[50%] text-[12px] font-medium transition-colors ${
                  isSelected 
                    ? "bg-[var(--primary)] text-[var(--card)] border border-[var(--primary)]" 
                    : "bg-[var(--card)] text-[var(--ink-soft)] border border-[var(--rule)]"
                }`}
              >
                {LETTERS[idx]}
              </div>
              <span className="text-[16px] text-[var(--ink)] leading-[1.6]">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

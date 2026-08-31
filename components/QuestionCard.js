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
    <div className="flex flex-col">
      <h2 
        style={{ fontFamily: "var(--font-ibm-plex-sans)", fontWeight: 500 }}
        className="text-[20px] text-[var(--ink)] leading-[1.4] mb-[24px]"
      >
        {question.prompt}
      </h2>
      <div className="flex flex-col gap-[8px]">
        {question.options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              aria-pressed={isSelected}
              className={`w-full flex items-center gap-[16px] text-left px-[16px] py-[16px] min-h-[56px] border rounded-[8px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] ${
                isSelected
                  ? "bg-[var(--primary)] border-[var(--primary)] text-[var(--card)] shadow-md transform scale-[1.01]"
                  : "bg-[var(--card)] border-[var(--rule)] text-[var(--ink)] hover:border-[var(--ink-soft)] hover:shadow-sm"
              }`}
            >
              <div 
                style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
                className={`flex shrink-0 items-center justify-center w-[28px] h-[28px] rounded-[50%] text-[14px] font-medium transition-colors ${
                  isSelected 
                    ? "bg-[var(--card)] text-[var(--primary)]" 
                    : "bg-[var(--paper)] text-[var(--ink-soft)] border border-[var(--rule)]"
                }`}
              >
                {LETTERS[idx]}
              </div>
              <span style={{ fontFamily: "var(--font-ibm-plex-sans)" }} className={`text-[16px] leading-[1.5] ${isSelected ? "text-[var(--card)]" : "text-[var(--ink)]"}`}>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

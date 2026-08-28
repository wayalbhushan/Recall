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
              className={`w-full flex items-center gap-[12px] text-left px-[12px] py-[12px] min-h-[48px] border rounded-[4px] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] ${
                isSelected
                  ? "bg-[var(--card)] border-[var(--primary)] shadow-[inset_0_0_0_1px_var(--primary)]"
                  : "bg-[var(--card)] border-[var(--rule)] hover:border-[var(--ink-soft)]"
              }`}
            >
              <div 
                style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
                className={`flex shrink-0 items-center justify-center w-[24px] h-[24px] rounded-[50%] text-[12px] font-medium transition-colors ${
                  isSelected 
                    ? "bg-[var(--primary)] text-[var(--card)]" 
                    : "bg-[var(--card)] text-[var(--ink-soft)] border border-[var(--rule)]"
                }`}
              >
                {LETTERS[idx]}
              </div>
              <span style={{ fontFamily: "var(--font-ibm-plex-sans)" }} className="text-[16px] text-[var(--ink)] leading-[1.5]">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

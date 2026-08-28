"use client";

import { useState, useRef } from "react";

const OPTIONS = {
  count: [3, 5, 10],
  difficulty: ["easy", "medium", "hard"],
  style: ["facts", "applied", "mixed"]
};

function SegmentedControl({ label, options, value, onChange, disabled }) {
  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = (index + 1) % options.length;
      onChange(options[next]);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (index - 1 + options.length) % options.length;
      onChange(options[prev]);
    }
  };

  return (
    <div className="flex flex-col gap-[8px]">
      <span style={{ fontFamily: "var(--font-ibm-plex-mono)" }} className="text-[12px] uppercase text-[var(--ink-soft)]">
        {label}
      </span>
      <div 
        role="radiogroup" 
        aria-label={label}
        className="flex w-full border border-[var(--rule)] rounded-[4px] overflow-hidden"
      >
        {options.map((opt, i) => {
          const isSelected = value === opt;
          return (
            <button
              key={opt}
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onChange(opt)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              tabIndex={isSelected ? 0 : -1}
              style={{ fontFamily: "var(--font-ibm-plex-sans)" }}
              className={`flex-1 py-[8px] px-[4px] text-[14px] text-center capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:z-10 ${
                isSelected 
                  ? "bg-[var(--primary)] text-[var(--card)]" 
                  : "bg-[var(--card)] text-[var(--ink-soft)] hover:text-[var(--ink)]"
              } ${i > 0 ? "border-l border-[var(--rule)]" : ""}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function GenerationControls({ value, onChange, disabled }) {
  const [expanded, setExpanded] = useState(false);

  const update = (key, val) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-[12px]">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls="generation-controls-panel"
          onClick={() => setExpanded(!expanded)}
          disabled={disabled}
          className="text-[14px] font-medium text-[var(--ink)] hover:text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] rounded-[4px] transition-colors disabled:opacity-50"
        >
          Options
        </button>
        <span style={{ fontFamily: "var(--font-ibm-plex-mono)" }} className="text-[12px] text-[var(--ink-soft)]">
          {value.count} &middot; {value.difficulty} &middot; {value.style}
        </span>
      </div>

      {expanded && (
        <div id="generation-controls-panel" className="flex flex-col gap-[24px] mt-[24px] p-[24px] border border-[var(--rule)] bg-[var(--paper)] rounded-[4px]">
          <div className="flex flex-col sm:flex-row gap-[24px] w-full">
            <SegmentedControl 
              label="Questions" 
              options={OPTIONS.count} 
              value={value.count} 
              onChange={(v) => update("count", v)} 
              disabled={disabled} 
            />
            <SegmentedControl 
              label="Difficulty" 
              options={OPTIONS.difficulty} 
              value={value.difficulty} 
              onChange={(v) => update("difficulty", v)} 
              disabled={disabled} 
            />
            <SegmentedControl 
              label="Recall" 
              options={OPTIONS.style} 
              value={value.style} 
              onChange={(v) => update("style", v)} 
              disabled={disabled} 
            />
          </div>
          
          <div className="flex flex-col gap-[8px]">
            <label htmlFor="special-instructions" style={{ fontFamily: "var(--font-ibm-plex-mono)" }} className="text-[12px] uppercase text-[var(--ink-soft)]">
              Special Instructions
            </label>
            <textarea
              id="special-instructions"
              rows={2}
              maxLength={200}
              value={value.instructions}
              onChange={(e) => update("instructions", e.target.value)}
              disabled={disabled}
              placeholder="Focus on the light-dependent reactions"
              className="w-full resize-none p-[12px] border border-[var(--rule)] rounded-[4px] text-[14px] text-[var(--ink)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--ink-soft)] disabled:opacity-50"
            />
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-[var(--ink-soft)]">Optional. Ignored if empty.</span>
              <span style={{ fontFamily: "var(--font-ibm-plex-mono)" }} className="text-[12px] text-[var(--ink-soft)]">
                {value.instructions.length} / 200
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

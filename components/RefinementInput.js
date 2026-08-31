"use client";

import { useState } from "react";

export default function RefinementInput({ onRefine, isLoading }) {
  const [instruction, setInstruction] = useState("");
  const trimmed = instruction.trim();
  const isValid = trimmed.length >= 3;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid || isLoading) return;
    onRefine(trimmed);
    setInstruction("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-[8px] p-[16px] border border-[var(--rule)] bg-[var(--card)] rounded-[4px]"
    >
      <label
        htmlFor="refine-input"
        style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
        className="text-[12px] uppercase text-[var(--ink-soft)]"
      >
        Refine
      </label>
      <div className="flex gap-[8px]">
        <input
          id="refine-input"
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          disabled={isLoading}
          placeholder="e.g. make harder, focus on chapter 3..."
          maxLength={200}
          className="flex-1 px-[12px] py-[8px] border border-[var(--rule)] rounded-[4px] text-[14px] text-[var(--ink)] bg-[var(--card)] placeholder:text-[var(--ink-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="px-[24px] py-[8px] bg-[var(--primary)] text-[var(--card)] rounded-[4px] text-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary)] shrink-0 shadow-sm hover:scale-[1.02] transition-transform"
        >
          {isLoading ? "Refining…" : "Refine"}
        </button>
      </div>
      <p className="text-[12px] text-[var(--ink-soft)]">
        Edits the current quiz in place. Changes take effect on the next review.
      </p>
    </form>
  );
}

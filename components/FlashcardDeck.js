"use client";

import { useState, useEffect } from "react";

function FlipCard({ card, isActive }) {
  const [flipped, setFlipped] = useState(false);

  // Reset flip when card changes
  useEffect(() => {
    setFlipped(false);
  }, [card.id]);

  const handleKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setFlipped((f) => !f);
    }
  };

  return (
    <div
      role="button"
      tabIndex={isActive ? 0 : -1}
      aria-label={flipped ? `Back: ${card.back}` : `Front: ${card.front}. Press Space to flip.`}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={handleKeyDown}
      className="relative w-full cursor-pointer select-none focus:outline-none"
      style={{ perspective: "1000px", minHeight: "280px" }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          minHeight: "280px",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-[32px] bg-[var(--card)] border border-[var(--rule)] rounded-[4px]"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <span
            style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
            className="text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-[16px]"
          >
            Front — tap to flip
          </span>
          <p className="text-[20px] text-[var(--ink)] text-center leading-[1.5] font-medium">
            {card.front}
          </p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-[32px] bg-[var(--primary)] border border-[var(--primary)] rounded-[4px]"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span
            style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
            className="text-[11px] uppercase tracking-wider text-[rgba(255,255,255,0.6)] mb-[16px]"
          >
            Back
          </span>
          <p className="text-[18px] text-[var(--card)] text-center leading-[1.6]">
            {card.back}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FlashcardDeck({ deck, reset, mode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { title, cards } = deck;
  const total = cards.length;
  const card = cards[currentIndex];
  const progressPercent = ((currentIndex + 1) / total) * 100;

  const handlePrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setCurrentIndex((i) => Math.min(total - 1, i + 1));

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex]);

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Progress bar */}
      <div className="w-full h-[2px] bg-[var(--rule)]">
        <div
          className="h-full bg-[var(--primary)] transition-all duration-200 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex flex-col gap-[16px]">
        <div className="flex items-center justify-between">
          <span
            style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
            className="text-[12px] uppercase text-[var(--ink-soft)]"
          >
            Card {currentIndex + 1} of {total}
          </span>
          <span
            style={{ fontFamily: "var(--font-ibm-plex-serif)" }}
            className="text-[14px] text-[var(--ink-soft)] truncate max-w-[200px]"
          >
            {title}
          </span>
        </div>

        <FlipCard key={card.id} card={card} isActive={true} />

        {/* Navigation */}
        <div className="flex items-center justify-between pt-[8px]">
          <button
            type="button"
            onClick={handlePrev}
            className={`px-[24px] py-[12px] text-[16px] text-[var(--ink)] bg-[var(--card)] border border-[var(--rule)] hover:bg-[var(--paper)] font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-[4px] shadow-sm transition-colors ${currentIndex === 0 ? "invisible" : ""}`}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            className={`px-[32px] py-[12px] bg-[var(--primary)] text-[var(--card)] rounded-[4px] text-[16px] font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary)] shadow-sm hover:scale-[1.02] transition-transform ${currentIndex === total - 1 ? "invisible" : ""}`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Done / reset */}
      <div className="flex flex-col items-center gap-[8px] pt-[8px] border-t border-[var(--rule)]">
        <p
          style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
          className="text-[12px] text-[var(--ink-soft)]"
        >
          {currentIndex === total - 1 ? "End of deck — all cards reviewed." : "Space or tap a card to flip it."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="text-[14px] text-[var(--ink-soft)] hover:text-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-[4px] px-[8px] py-[4px]"
        >
          {mode === "both" ? "Done" : "New topic"}
        </button>
      </div>
    </div>
  );
}

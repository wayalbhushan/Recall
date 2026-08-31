"use client";
import { useState, useEffect } from "react";

export function EmptyIdle() {
  return (
    <div className="py-[48px] text-center">
      <p className="text-[16px] text-[var(--ink)] leading-[1.6]">
        Provide a topic or paste your notes above.
        <br />
        Notes work just as well as a short topic.
      </p>
    </div>
  );
}

export function LoadingSkeleton() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const phrases = [
    "Reading your topic...",
    "Brewing some questions...",
    "Writing flashcards...",
    "Checking the answers...",
    "Almost there..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIdx((prev) => (prev + 1) % phrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <div className="flex flex-col gap-[24px] w-full items-center justify-center py-[64px]">
      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.2; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
      `}</style>
      
      <div className="relative flex items-center justify-center w-[80px] h-[80px]">
        <div className="absolute inset-0 rounded-full border-[4px] border-[var(--rule)]" style={{ animation: 'pulse-ring 2s ease-in-out infinite' }}></div>
        <div className="absolute inset-0 rounded-full border-[4px] border-t-[var(--primary)] border-r-transparent border-b-transparent border-l-transparent" style={{ animation: 'spin-slow 1s linear infinite' }}></div>
      </div>

      <div className="h-[24px] overflow-hidden">
        <p 
          style={{ fontFamily: "var(--font-ibm-plex-mono)" }} 
          className="text-[14px] uppercase text-[var(--ink)] tracking-wider transition-all duration-300 transform translate-y-0 text-center"
          key={phraseIdx}
        >
          {phrases[phraseIdx]}
        </p>
      </div>
    </div>
  );
}

export function ErrorView({ code, onRetry, onClose }) {
  let message = "An unhandled error interrupted the request.";
  if (code === "TOPIC_TOO_SHORT") message = "The topic requires at least 3 characters.";
  if (code === "TOPIC_TOO_LONG") message = "The topic exceeds the 4000 character limit.";
  if (code === "INSTRUCTIONS_TOO_LONG") message = "The special instructions exceed the 200 character limit.";
  if (code === "MISSING_API_KEY") message = "The server lacks a configured API key.";
  if (code === "BAD_MODEL_OUTPUT") message = "The model returned unreadable data.";
  if (code === "UPSTREAM_FAILED") message = "The model service did not respond.";
  if (code === "NETWORK_ERROR") message = "The request could not reach the server.";
  if (code === "TIMEOUT") message = "The request took too long and was cancelled.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-[16px] bg-[rgba(26,29,36,0.3)] animate-screen-enter">
      <div className="flex flex-col p-[24px] border border-[var(--rule)] border-l-[4px] border-l-[var(--mark)] rounded-[4px] bg-[var(--card)] shadow-[0_4px_12px_rgba(26,29,36,0.15)] sm:min-w-[360px] max-w-[400px] w-full">
        <div className="flex justify-between items-start gap-[16px]">
          <p className="text-[16px] text-[var(--ink)] leading-[1.6] mt-[2px]">{message}</p>
          <button 
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[var(--ink-soft)] hover:text-[var(--ink)] focus:outline-none shrink-0 p-[4px] -mt-[4px] -mr-[4px]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="flex justify-end gap-[8px] mt-[16px]">
          <button 
            type="button"
            onClick={onRetry}
            className="text-[14px] text-[var(--ink-soft)] hover:text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] rounded-[4px] px-[8px] py-[4px] -mr-[8px]"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

export function EmptyResult({ onRetry }) {
  return (
    <div className="flex flex-col items-start gap-[16px] p-[24px] border border-[var(--rule)] rounded-[4px] bg-[var(--card)]">
      <p className="text-[16px] text-[var(--ink)] leading-[1.6]">
        The model returned no usable questions. Try providing a more specific topic or detailed notes.
      </p>
      <button 
        onClick={onRetry}
        className="px-[16px] py-[8px] bg-[var(--primary)] text-[var(--card)] rounded-[4px] text-[16px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
      >
        Try again
      </button>
    </div>
  );
}

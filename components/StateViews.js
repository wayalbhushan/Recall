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
  return (
    <div className="flex flex-col gap-[24px] w-full">
      <style>{`
        @keyframes quiet-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.4; }
        }
        .animate-quiet-pulse {
          animation: quiet-pulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-quiet-pulse flex flex-col gap-[16px] p-[24px] border border-[var(--rule)] rounded-[4px] bg-[var(--card)]">
          <div className="h-[24px] bg-[var(--rule)] rounded-[4px] w-3/4 mb-[8px]"></div>
          {[1, 2, 3, 4].map((j) => (
            <div key={j} className="flex items-center gap-[12px]">
              <div className="w-[24px] h-[24px] shrink-0 border border-[var(--rule)] bg-[var(--rule)]" style={{ borderRadius: '50%' }}></div>
              <div className="h-[20px] bg-[var(--rule)] rounded-[4px] w-1/2"></div>
            </div>
          ))}
        </div>
      ))}
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

  return (
    <div className="fixed bottom-[32px] left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] sm:w-auto animate-screen-enter">
      <div className="flex flex-col p-[16px] border border-[var(--rule)] border-l-[4px] border-l-[var(--mark)] rounded-[4px] bg-[var(--card)] shadow-[0_4px_12px_rgba(26,29,36,0.15)] sm:min-w-[320px] max-w-[400px] mx-auto">
        <div className="flex justify-between items-start gap-[16px]">
          <p className="text-[14px] text-[var(--ink)] leading-[1.5] mt-[2px]">{message}</p>
          <button 
            onClick={onClose}
            aria-label="Close"
            className="text-[var(--ink-soft)] hover:text-[var(--ink)] focus:outline-none shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="flex justify-end gap-[8px] mt-[12px]">
          <button 
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

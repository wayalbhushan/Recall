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

export function ErrorView({ code, onRetry }) {
  let message = "An unknown error occurred. Please try again.";
  if (code === "TOPIC_TOO_SHORT") message = "The topic is too short. Please provide a longer topic or more notes.";
  if (code === "TOPIC_TOO_LONG") message = "The text provided exceeds the 4000 character limit. Please shorten it.";
  if (code === "MISSING_API_KEY") message = "The server is missing its configured API key.";
  if (code === "BAD_MODEL_OUTPUT") message = "The model returned unreadable data after multiple attempts.";
  if (code === "UPSTREAM_FAILED") message = "The model service did not respond.";
  if (code === "NETWORK_ERROR") message = "The request could not be sent to the server.";

  return (
    <div className="flex flex-col items-start gap-[16px] p-[24px] border border-[var(--rule)] border-l-[4px] border-l-[var(--mark)] rounded-[4px] bg-[var(--card)]">
      <p className="text-[16px] text-[var(--ink)] leading-[1.6]">{message}</p>
      <button 
        onClick={onRetry}
        className="px-[16px] py-[8px] bg-[var(--primary)] text-[var(--card)] rounded-[4px] text-[16px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
      >
        Try again
      </button>
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

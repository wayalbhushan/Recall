"use client";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function SessionDrawer({ sessions, onLoad, onDelete }) {
  if (!sessions || sessions.length === 0) return null;

  return (
    <div className="flex flex-col gap-[12px] p-[16px] border border-[var(--rule)] bg-[var(--card)] rounded-[4px]">
      <span
        style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
        className="text-[12px] uppercase text-[var(--ink-soft)]"
      >
        Saved sessions
      </span>
      <ul className="flex flex-col divide-y divide-[var(--rule)]">
        {sessions.map((s) => (
          <li key={s.id} className="flex items-center justify-between gap-[12px] py-[10px]">
            <div className="flex flex-col gap-[2px] min-w-0">
              <span className="text-[14px] text-[var(--ink)] truncate leading-[1.4]">
                {s.topic || "Untitled"}
              </span>
              <span
                style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
                className="text-[11px] text-[var(--ink-soft)]"
              >
                {formatDate(s.savedAt)} &middot; {s.quiz?.questions?.length ?? 0}q
              </span>
            </div>
            <div className="flex items-center gap-[8px] shrink-0">
              <button
                type="button"
                onClick={() => onLoad(s)}
                className="px-[16px] py-[8px] bg-[var(--primary)] text-[var(--card)] rounded-[4px] text-[13px] font-medium shadow-sm hover:scale-[1.02] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary)]"
              >
                Load
              </button>
              <button
                type="button"
                onClick={() => onDelete(s.id)}
                aria-label="Delete session"
                className="flex items-center justify-center w-[32px] h-[32px] bg-[var(--card)] border border-[var(--rule)] text-[18px] text-[var(--ink-soft)] hover:text-[var(--mark)] hover:border-[var(--mark)] hover:bg-[var(--paper)] rounded-[4px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] shadow-sm"
              >
                &times;
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

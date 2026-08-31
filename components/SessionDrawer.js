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
                className="text-[13px] text-[var(--primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-[2px] px-[4px]"
              >
                Load
              </button>
              <button
                type="button"
                onClick={() => onDelete(s.id)}
                aria-label="Delete session"
                className="text-[13px] text-[var(--ink-soft)] hover:text-[var(--mark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-[2px] px-[4px]"
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

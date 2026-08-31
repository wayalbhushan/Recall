"use client";

export default function ReadyScreen({ quiz, settings, requestedCount, mode, onStart, onReset }) {
  return (
    <div className="flex flex-col gap-[32px] w-full items-center text-center py-[48px]">
      <div className="flex flex-col gap-[16px] items-center">
        <span style={{ fontFamily: "var(--font-ibm-plex-mono)" }} className="text-[12px] uppercase text-[var(--ink-soft)] tracking-wider">
          Ready
        </span>
        <h2 style={{ fontFamily: "var(--font-ibm-plex-serif)" }} className="text-[28px] text-[var(--ink)] leading-[1.15]">
          {quiz.title}
        </h2>
        {settings && (
          <span style={{ fontFamily: "var(--font-ibm-plex-mono)" }} className="text-[14px] text-[var(--ink-soft)]">
            {requestedCount} questions &middot; {settings.difficulty} &middot; {settings.style}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-[16px] items-center w-full max-w-[320px]">
        {(quiz.droppedCount > 0 || quiz.shortfall > 0) && (
          <p style={{ fontFamily: "var(--font-ibm-plex-mono)" }} className="text-[12px] text-[var(--ink-soft)] w-full text-center">
            {quiz.droppedCount > 0 && `${quiz.droppedCount} ${quiz.droppedCount === 1 ? "question was" : "questions were"} dropped because the model returned ${quiz.droppedCount === 1 ? "it" : "them"} incomplete.`}
            {quiz.droppedCount > 0 && quiz.shortfall > 0 && " "}
            {quiz.shortfall > 0 && `You asked for ${requestedCount} questions; ${quiz.questions.length} were usable.`}
          </p>
        )}

        <div className="flex flex-col gap-[12px] w-full mt-[16px]">
          {mode === "both" ? (
            <>
              <button
                onClick={() => onStart("flashcards")}
                className="w-full sm:w-auto px-[32px] py-[12px] bg-[var(--primary)] text-[var(--card)] rounded-[4px] text-[16px] font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] shadow-sm hover:scale-[1.02] transition-transform"
              >
                Study flashcards
              </button>
              <button
                onClick={() => onStart("quiz")}
                className="w-full sm:w-auto px-[32px] py-[12px] bg-[var(--primary)] text-[var(--card)] rounded-[4px] text-[16px] font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] shadow-sm hover:scale-[1.02] transition-transform"
              >
                Take quiz
              </button>
            </>
          ) : (
            <button
              onClick={() => onStart(mode)}
              className="w-full sm:w-auto px-[32px] py-[12px] bg-[var(--primary)] text-[var(--card)] rounded-[4px] text-[16px] font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] shadow-sm hover:scale-[1.02] transition-transform"
            >
              Start {mode === "flashcards" ? "flashcards" : "quiz"}
            </button>
          )}
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-[32px] py-[12px] bg-transparent text-[var(--ink-soft)] hover:text-[var(--ink)] rounded-[4px] text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] hover:scale-[1.02] transition-transform"
          >
            Change topic
          </button>
        </div>

        <span style={{ fontFamily: "var(--font-ibm-plex-mono)" }} className="text-[12px] text-[var(--ink-soft)] mt-[16px]">
          {mode === "flashcards" ? "space to flip \u00B7 arrow keys to move" : mode === "quiz" ? "1-4 to answer \u00B7 arrow keys to move" : "select an activity to start"}
        </span>
      </div>
    </div>
  );
}

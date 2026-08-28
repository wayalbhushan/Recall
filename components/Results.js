"use client";

const LETTERS = ["A", "B", "C", "D"];

export default function Results({ quiz, answers, onRetest, onReset }) {
  const { title, questions } = quiz;
  const wrongIds = [];
  let score = 0;

  const resultsList = questions.map((q) => {
    const userAnswerIndex = answers[q.id];
    const isCorrect = userAnswerIndex === q.correctIndex;
    if (isCorrect) score++;
    else wrongIds.push(q.id);

    return {
      q,
      userAnswerIndex,
      isCorrect
    };
  });

  const total = questions.length;
  const allCorrect = wrongIds.length === 0;

  return (
    <div className="flex flex-col gap-[48px] p-[24px] bg-[var(--card)] border border-[var(--rule)] rounded-[4px]">
      <div className="flex flex-col gap-[16px]">
        <h2 style={{ fontFamily: "var(--font-ibm-plex-serif)" }} className="text-[28px] text-[var(--ink)] font-semibold">
          {title}
        </h2>
        <div style={{ fontFamily: "var(--font-ibm-plex-mono)" }} className="text-[40px] text-[var(--ink)]">
          {score} / {total}
        </div>
      </div>

      <div className="flex flex-col gap-[32px]">
        {resultsList.map(({ q, userAnswerIndex, isCorrect }) => (
          <div key={q.id} className="flex">
            <div className="w-[48px] shrink-0 pt-[4px]">
              <span 
                style={{ fontFamily: "var(--font-ibm-plex-mono)" }} 
                className={`text-[20px] ${isCorrect ? "text-[var(--correct)]" : "text-[var(--mark)]"}`}
              >
                {isCorrect ? "✓" : "✗"}
              </span>
            </div>
            <div className="flex flex-col gap-[8px] flex-1">
              <p className="text-[16px] text-[var(--ink)] font-medium leading-[1.6]">
                {q.prompt}
              </p>
              
              <div className="flex flex-col gap-[4px] mt-[8px]">
                <p className="text-[16px] text-[var(--ink)] leading-[1.6]">
                  <span className="text-[var(--ink-soft)] mr-[8px]">Your answer:</span>
                  {userAnswerIndex !== undefined ? q.options[userAnswerIndex] : "Skipped"}
                </p>
                {!isCorrect && (
                  <p className="text-[16px] text-[var(--ink)] leading-[1.6]">
                    <span className="text-[var(--ink-soft)] mr-[8px]">Correct answer:</span>
                    {q.options[q.correctIndex]}
                  </p>
                )}
              </div>
              
              {q.explanation && (
                <p className="mt-[8px] text-[16px] text-[var(--ink-soft)] leading-[1.6]">
                  {q.explanation}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-[16px] border-t border-[var(--rule)] pt-[24px]">
        {!allCorrect && (
          <button
            onClick={() => onRetest(wrongIds)}
            className="px-[24px] py-[12px] bg-[var(--primary)] text-[var(--card)] rounded-[4px] text-[16px] font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
          >
            Retest {wrongIds.length} wrong {wrongIds.length === 1 ? "answer" : "answers"}
          </button>
        )}
        <button
          onClick={onReset}
          className={`px-[24px] py-[12px] rounded-[4px] text-[16px] font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] ${
            allCorrect 
              ? "bg-[var(--primary)] text-[var(--card)]" 
              : "border border-[var(--rule)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--ink-soft)]"
          }`}
        >
          New topic
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import QuestionCard from "./QuestionCard";
import Results from "./Results";

export default function Quiz({ quiz, reset, mode }) {
  const [answers, setAnswers] = useState({});
  const [activeIds, setActiveIds] = useState(quiz.questions.map(q => q.id));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const activeQuestionId = activeIds[currentIndex];
  const activeQuestion = quiz.questions.find(q => q.id === activeQuestionId);
  const selectedIndex = answers[activeQuestionId];
  const totalActive = activeIds.length;
  const isRetest = totalActive < quiz.questions.length;

  const handleSelect = (idx) => {
    setAnswers(prev => ({ ...prev, [activeQuestionId]: idx }));
  };

  const handleNext = () => {
    if (selectedIndex === undefined) return;
    if (currentIndex < totalActive - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFinished) return;
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;

      if (e.key === "ArrowRight") {
        if (selectedIndex !== undefined) handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Enter") {
        if (selectedIndex !== undefined) handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isFinished, selectedIndex, totalActive]);

  const handleRetest = (wrongIds) => {
    setActiveIds(wrongIds);
    setCurrentIndex(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="animate-screen-enter">
        <Results quiz={quiz} answers={answers} onRetest={handleRetest} onReset={reset} mode={mode} />
      </div>
    );
  }

  const label = isRetest 
    ? `RETEST ${currentIndex + 1} OF ${totalActive}`
    : `QUESTION ${currentIndex + 1} OF ${totalActive}`;

  const isLast = currentIndex === totalActive - 1;
  const progressPercent = ((currentIndex + 1) / totalActive) * 100;

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="w-full h-[2px] bg-[var(--rule)]">
        <div 
          className="h-full bg-[var(--primary)] transition-all duration-200 ease-out" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <div className="flex flex-col gap-[16px]">
        <span style={{ fontFamily: "var(--font-ibm-plex-mono)" }} className="text-[12px] uppercase text-[var(--ink-soft)]">
          {label}
        </span>

        <div className="bg-[var(--card)] border border-[var(--rule)] rounded-[4px] p-[16px] sm:p-[24px] shadow-[0_1px_2px_rgba(26,29,36,0.04)] min-h-[400px] flex flex-col">
          <div key={activeQuestionId} className="animate-question-enter flex-1">
            <QuestionCard 
              question={activeQuestion} 
              selectedIndex={selectedIndex} 
              onSelect={handleSelect} 
            />
          </div>

          <div className="mt-[24px] pt-[16px] border-t border-[var(--rule)] flex items-center justify-between">
            <button
              onClick={handlePrev}
              className={`px-[16px] py-[8px] text-[16px] text-[var(--ink-soft)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] rounded-[4px] ${currentIndex === 0 ? "invisible" : ""}`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={selectedIndex === undefined}
              className="px-[24px] py-[8px] bg-[var(--primary)] text-[var(--card)] rounded-[4px] text-[16px] font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
            >
              {isLast ? "See results" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

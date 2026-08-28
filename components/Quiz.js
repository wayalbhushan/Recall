"use client";

import { useState } from "react";
import QuestionCard from "./QuestionCard";
import Results from "./Results";

export default function Quiz({ quiz, reset }) {
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
    if (currentIndex < totalActive - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetest = (wrongIds) => {
    setActiveIds(wrongIds);
    setCurrentIndex(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <Results 
        quiz={quiz} 
        answers={answers} 
        onRetest={handleRetest} 
        onReset={reset} 
      />
    );
  }

  const label = isRetest 
    ? `Retest ${currentIndex + 1} of ${totalActive}`
    : `Question ${currentIndex + 1} of ${totalActive}`;

  const isLast = currentIndex === totalActive - 1;

  return (
    <div className="flex flex-col gap-[32px] p-[24px] bg-[var(--card)] border border-[var(--rule)] rounded-[4px]">
      <div className="flex justify-between items-center border-b border-[var(--rule)] pb-[16px]">
        <h3 className="text-[20px] text-[var(--ink)] font-semibold" style={{ fontFamily: "var(--font-ibm-plex-serif)" }}>
          {quiz.title}
        </h3>
        <span style={{ fontFamily: "var(--font-ibm-plex-mono)" }} className="text-[14px] text-[var(--ink-soft)]">
          {label}
        </span>
      </div>

      <QuestionCard 
        question={activeQuestion} 
        selectedIndex={selectedIndex} 
        onSelect={handleSelect} 
      />

      <div className="flex justify-end pt-[16px]">
        <button
          onClick={handleNext}
          disabled={selectedIndex === undefined}
          className="px-[24px] py-[12px] bg-[var(--primary)] text-[var(--card)] rounded-[4px] text-[16px] font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
        >
          {isLast ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}

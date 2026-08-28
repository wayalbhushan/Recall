"use client";

import { useState } from "react";
import useQuiz from "@/hooks/useQuiz";
import TopicInput from "@/components/TopicInput";
import { EmptyIdle, LoadingSkeleton, ErrorView, EmptyResult } from "@/components/StateViews";
import Quiz from "@/components/Quiz";
import ReadyScreen from "@/components/ReadyScreen";

export default function Page() {
  const { status, quiz, errorCode, droppedCount, requestedCount, generate, reset } = useQuiz();
  const [topic, setTopic] = useState("");
  const [settings, setSettings] = useState(null);
  const [activeScreen, setActiveScreen] = useState("setup");

  let screen = "setup";
  if (status === "ready") {
    screen = activeScreen === "quiz" ? "quiz" : "ready";
  } else if (status === "idle" || status === "loading" || status === "error" || status === "empty") {
    screen = "setup";
  }

  const handleGenerate = (controls) => {
    setSettings(controls);
    generate(topic, controls);
    setActiveScreen("setup");
  };

  const handleReset = () => {
    setTopic("");
    setActiveScreen("setup");
    reset();
  };

  const isQuizScreen = screen === "quiz";

  return (
    <div className="min-h-screen bg-[var(--paper)] py-[48px] px-[16px]">
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .animate-screen-enter {
            animation: screen-enter 200ms ease-out forwards;
          }
          @keyframes screen-enter {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        }
      `}</style>
      <div className="max-w-[720px] mx-auto flex flex-col gap-[32px]">
        
        <header className="flex flex-col gap-[8px] text-center sm:text-left transition-all duration-200">
          <h1 
            style={{ fontFamily: "var(--font-ibm-plex-serif)" }} 
            className={`font-semibold text-[var(--ink)] leading-[1.15] transition-all duration-200 ${isQuizScreen ? "text-[20px]" : "text-[40px]"}`}
          >
            Recall
          </h1>
          <p className="text-[16px] text-[var(--ink-soft)]">
            Turn your notes into a test.
          </p>
        </header>

        <main className="w-full relative">
          <div key={screen} className="animate-screen-enter">
            {screen === "setup" && (
              <div className="flex flex-col gap-[32px]">
                <TopicInput 
                  topic={topic}
                  setTopic={setTopic}
                  status={status} 
                  onGenerate={handleGenerate} 
                  onReset={handleReset} 
                />
                
                {status === "idle" && <EmptyIdle />}
                {status === "loading" && <LoadingSkeleton />}
                {status === "error" && <ErrorView code={errorCode} onRetry={() => generate(topic, settings)} />}
                {status === "empty" && <EmptyResult onRetry={handleReset} />}
              </div>
            )}

            {screen === "ready" && (
              <ReadyScreen 
                quiz={{ ...quiz, droppedCount, shortfall: quiz?.shortfall || 0 }} 
                settings={settings} 
                requestedCount={requestedCount} 
                onStart={() => setActiveScreen("quiz")} 
                onReset={handleReset} 
              />
            )}

            {screen === "quiz" && (
              <Quiz quiz={quiz} reset={handleReset} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

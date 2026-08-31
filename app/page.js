"use client";

import { useState, useEffect } from "react";
import useQuiz from "@/hooks/useQuiz";
import useSessions from "@/hooks/useSessions";
import TopicInput from "@/components/TopicInput";
import { EmptyIdle, LoadingSkeleton, ErrorView, EmptyResult } from "@/components/StateViews";
import Quiz from "@/components/Quiz";
import FlashcardDeck from "@/components/FlashcardDeck";
import ReadyScreen from "@/components/ReadyScreen";
import ThemeToggle from "@/components/ThemeToggle";
import SessionDrawer from "@/components/SessionDrawer";
import RefinementInput from "@/components/RefinementInput";

export default function Page() {
  const { status, quiz, errorCode, droppedCount, shortfall, requestedCount, mode, generate, reset, refine, isRefining, loadSessionData } = useQuiz();
  const { sessions, saveSession, deleteSession } = useSessions();
  const [topic, setTopic] = useState("");
  const [settings, setSettings] = useState(null);
  const [activeScreen, setActiveScreen] = useState("setup");

  let screen = "setup";
  if (status === "ready") {
    screen = activeScreen === "quiz" || activeScreen === "flashcards" ? activeScreen : "ready";
  } else if (status === "idle" || status === "loading" || status === "error" || status === "empty") {
    screen = "setup";
  }

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [screen]);

  // Auto-save completed quiz to sessions
  useEffect(() => {
    if (status === "ready" && quiz && topic && settings) {
      saveSession(topic, quiz, settings);
    }
  }, [status, quiz]);

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

  const handleDone = () => {
    if (mode === "both") {
      setActiveScreen("ready");
    } else {
      handleReset();
    }
  };

  const handleLoadSession = (session) => {
    setTopic(session.topic);
    setSettings(session.settings);
    loadSessionData(session.quiz, session.settings);
    setActiveScreen("ready");
  };

  const isQuizScreen = screen === "quiz";
  const isFlashcards = mode === "flashcards";

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
        
        <header className="flex items-start justify-between gap-[16px] transition-all duration-200">
          <div className="flex flex-col gap-[8px]">
            <h1 
              style={{ fontFamily: "var(--font-ibm-plex-serif)" }} 
              className={`font-semibold text-[var(--ink)] leading-[1.15] transition-all duration-200 ${isQuizScreen ? "text-[20px]" : "text-[40px]"}`}
            >
              Recall
            </h1>
            {!isQuizScreen && (
              <p className="text-[16px] text-[var(--ink-soft)]">
                Turn your notes into a test.
              </p>
            )}
          </div>
          <div className="pt-[4px] shrink-0">
            <ThemeToggle />
          </div>
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
                {status === "error" && <ErrorView code={errorCode} onRetry={() => generate(topic, settings)} onClose={reset} />}
                {status === "empty" && <EmptyResult onRetry={handleReset} />}

                {status === "idle" && (
                  <SessionDrawer
                    sessions={sessions}
                    onLoad={handleLoadSession}
                    onDelete={deleteSession}
                  />
                )}
              </div>
            )}

            {screen === "ready" && (
              <div className="flex flex-col gap-[24px]">
                <ReadyScreen 
                  quiz={{ ...quiz, droppedCount, shortfall }} 
                  settings={settings} 
                  requestedCount={requestedCount} 
                  mode={mode}
                  onStart={(activity) => setActiveScreen(activity)} 
                  onReset={handleReset} 
                />
                <RefinementInput onRefine={refine} isLoading={isRefining} />
              </div>
            )}

            {screen === "quiz" && (
              <Quiz quiz={quiz} reset={handleDone} mode={mode} />
            )}
            
            {screen === "flashcards" && (
              <FlashcardDeck deck={quiz} reset={handleDone} mode={mode} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

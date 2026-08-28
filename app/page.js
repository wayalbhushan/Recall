"use client";

import { useState } from "react";
import useQuiz from "@/hooks/useQuiz";
import TopicInput from "@/components/TopicInput";
import { EmptyIdle, LoadingSkeleton, ErrorView, EmptyResult } from "@/components/StateViews";

export default function Page() {
  const { status, quiz, errorCode, droppedCount, generate, reset } = useQuiz();
  const [topic, setTopic] = useState("");

  const handleGenerate = () => {
    generate(topic);
  };

  const handleReset = () => {
    setTopic("");
    reset();
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] py-[48px] px-[16px]">
      <div className="max-w-[720px] mx-auto flex flex-col gap-[32px]">
        
        <header className="flex flex-col gap-[8px] text-center sm:text-left">
          <h1 
            style={{ fontFamily: "var(--font-ibm-plex-serif)" }} 
            className="text-[40px] font-semibold text-[var(--ink)] leading-[1.15]"
          >
            Recall
          </h1>
          <p className="text-[16px] text-[var(--ink-soft)]">
            Turn your notes into a test.
          </p>
        </header>

        <TopicInput 
          topic={topic}
          setTopic={setTopic}
          status={status} 
          onGenerate={handleGenerate} 
          onReset={handleReset} 
        />

        <main className="w-full">
          {status === "idle" && <EmptyIdle />}
          
          {status === "loading" && <LoadingSkeleton />}
          
          {status === "error" && (
            <ErrorView 
              code={errorCode} 
              onRetry={handleGenerate} 
            />
          )}
          
          {status === "empty" && (
            <EmptyResult 
              onRetry={handleReset} 
            />
          )}

          {status === "ready" && (
            <div className="flex flex-col gap-[24px]">
              {droppedCount > 0 && (
                <p 
                  style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
                  className="text-[12px] text-[var(--ink-soft)]"
                >
                  {droppedCount} {droppedCount === 1 ? "question was" : "questions were"} dropped because the model returned {droppedCount === 1 ? "it" : "them"} incomplete.
                </p>
              )}
              <div className="p-[24px] bg-[var(--card)] border border-[var(--rule)] rounded-[4px]">
                <p className="text-[var(--ink)] text-[16px]">Quiz ready</p>
              </div>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { validateQuiz, validateFlashcards, validateCombined } from "@/lib/validate";

export default function useQuiz() {
  const [status, setStatus] = useState("idle");
  const [quiz, setQuiz] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [droppedCount, setDroppedCount] = useState(0);
  const [shortfall, setShortfall] = useState(0);
  const [requestedCount, setRequestedCount] = useState(5);
  const [isRefining, setIsRefining] = useState(false);
  const [mode, setMode] = useState("quiz");

  const requestId = useRef(0);
  const controller = useRef(null);
  const timedOutRef = useRef(false);

  const reset = () => {
    requestId.current += 1;
    if (controller.current) {
      controller.current.abort();
      controller.current = null;
    }
    setStatus("idle");
    setQuiz(null);
    setErrorCode(null);
    setDroppedCount(0);
    setShortfall(0);
    setRequestedCount(5);
    setMode("quiz");
  };

  const generate = async (topic, options = { count: 5, difficulty: "medium", style: "mixed", instructions: "" }, chaos = undefined) => {
    timedOutRef.current = false;
    requestId.current += 1;
    const myId = requestId.current;

    setStatus("loading");
    setErrorCode(null);
    setDroppedCount(0);
    setShortfall(0);
    setQuiz(null);
    setRequestedCount(options.count);
    setMode(options.mode || "quiz");

    const performRequest = async () => {
      let isRetry = false;
      let attempt = 0;

      while (attempt < 2) {
        attempt++;
        let timeoutId;

        if (controller.current) {
          controller.current.abort();
        }
        controller.current = new AbortController();

        try {
          timeoutId = setTimeout(() => {
            timedOutRef.current = true;
            if (controller.current) controller.current.abort();
          }, 25000);

          const body = { 
            topic,
            count: options.count,
            difficulty: options.difficulty,
            style: options.style,
            instructions: options.instructions,
            mode: options.mode || "quiz"
          };
          if (chaos !== undefined) body.chaos = chaos;
          if (isRetry) body.repair = true;

          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: controller.current.signal
          });

          if (myId !== requestId.current) return;

          if (!res.ok) {
            let errCode = "UNKNOWN_ERROR";
            try {
              const errorJson = await res.json();
              if (errorJson.error) errCode = errorJson.error;
            } catch (e) {}
            if (myId !== requestId.current) return;
            setErrorCode(errCode);
            setStatus("error");
            return;
          }

          const json = await res.json();
          if (myId !== requestId.current) return;

          let parsedData = null;
          let isParseError = false;
          try {
            parsedData = JSON.parse(json.raw);
          } catch (e) {
            isParseError = true;
          }

          if (isParseError) {
            if (!isRetry) {
              isRetry = true;
              continue;
            }
            setErrorCode("BAD_MODEL_OUTPUT");
            setStatus("error");
            return;
          }

          const currentMode = options.mode || "quiz";
          let result;
          if (currentMode === "both") {
            result = validateCombined(parsedData, options.count);
            if (!result.ok) {
              if (result.reason === "NO_VALID_CONTENT") { setStatus("empty"); return; }
              if (!isRetry) { isRetry = true; continue; }
              setErrorCode("BAD_MODEL_OUTPUT"); setStatus("error"); return;
            }
            setQuiz({ title: result.title, questions: result.questions, cards: result.cards });
            setDroppedCount(result.droppedCount);
            setShortfall(result.shortfall ?? 0);
          } else if (currentMode === "flashcards") {
            result = validateFlashcards(parsedData);
            if (!result.ok) {
              if (result.reason === "NO_VALID_CARDS") { setStatus("empty"); return; }
              if (!isRetry) { isRetry = true; continue; }
              setErrorCode("BAD_MODEL_OUTPUT"); setStatus("error"); return;
            }
            setQuiz({ title: result.title, cards: result.cards });
            setDroppedCount(result.droppedCount);
            setShortfall(0);
          } else {
            result = validateQuiz(parsedData, options.count);
            if (!result.ok) {
              if (result.reason === "NO_VALID_QUESTIONS") { setStatus("empty"); return; }
              if (!isRetry) { isRetry = true; continue; }
              setErrorCode("BAD_MODEL_OUTPUT"); setStatus("error"); return;
            }
            setQuiz({ title: result.title, questions: result.questions });
            setDroppedCount(result.droppedCount);
            setShortfall(result.shortfall ?? 0);
          }
          setStatus("ready");
          return;

        } catch (error) {
          if (myId !== requestId.current) return;
          if (error.name === "AbortError") {
            if (timedOutRef.current) {
              setErrorCode("TIMEOUT");
              setStatus("error");
            }
            return;
          }
          setErrorCode("NETWORK_ERROR");
          setStatus("error");
          return;
        } finally {
          clearTimeout(timeoutId);
        }
      }
    };

    performRequest();
  };

  const refine = async (instruction) => {
    if (!quiz || isRefining) return;
    setIsRefining(true);
    setErrorCode(null);
    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentQuiz: quiz,
          instruction,
          count: requestedCount,
          difficulty: "medium",
          style: "mixed",
          mode,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErrorCode(j.error || "UNKNOWN_ERROR");
        return;
      }
      const json = await res.json();
      let parsedData = null;
      try { parsedData = JSON.parse(json.raw); } catch {}
      if (!parsedData) { setErrorCode("BAD_MODEL_OUTPUT"); return; }

      if (mode === "both") {
        const result = validateCombined(parsedData, requestedCount);
        if (!result.ok) { setErrorCode("BAD_MODEL_OUTPUT"); return; }
        setQuiz({ title: result.title, questions: result.questions, cards: result.cards });
        setDroppedCount(result.droppedCount);
        setShortfall(result.shortfall ?? 0);
      } else if (mode === "flashcards") {
        const result = validateFlashcards(parsedData);
        if (!result.ok) { setErrorCode("BAD_MODEL_OUTPUT"); return; }
        setQuiz({ title: result.title, cards: result.cards });
        setDroppedCount(result.droppedCount);
      } else {
        const result = validateQuiz(parsedData, requestedCount);
        if (!result.ok) { setErrorCode("BAD_MODEL_OUTPUT"); return; }
        setQuiz({ title: result.title, questions: result.questions });
        setDroppedCount(result.droppedCount);
        setShortfall(result.shortfall ?? 0);
      }
    } catch {
      setErrorCode("NETWORK_ERROR");
    } finally {
      setIsRefining(false);
    }
  };

  const loadSessionData = (savedQuiz, options) => {
    if (controller.current) {
      controller.current.abort();
      controller.current = null;
    }
    setQuiz(savedQuiz);
    setRequestedCount(options?.count || 5);
    setMode(options?.mode || "quiz");
    setDroppedCount(0);
    setShortfall(0);
    setErrorCode(null);
    setStatus("ready");
  };

  return { status, quiz, errorCode, droppedCount, shortfall, requestedCount, mode, generate, reset, refine, isRefining, loadSessionData };
}

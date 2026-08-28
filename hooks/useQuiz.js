"use client";

import { useState, useRef } from "react";
import { validateQuiz } from "@/lib/validate";

export default function useQuiz() {
  const [status, setStatus] = useState("idle");
  const [quiz, setQuiz] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [droppedCount, setDroppedCount] = useState(0);
  const [requestedCount, setRequestedCount] = useState(5);

  const requestId = useRef(0);
  const controller = useRef(null);

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
    setRequestedCount(5);
  };

  const generate = async (topic, options = { count: 5, difficulty: "medium", style: "mixed", instructions: "" }, chaos = undefined) => {
    requestId.current += 1;
    const myId = requestId.current;

    setStatus("loading");
    setErrorCode(null);
    setDroppedCount(0);
    setQuiz(null);
    setRequestedCount(options.count);

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
            if (controller.current) controller.current.abort();
          }, 25000);

          const body = { 
            topic,
            count: options.count,
            difficulty: options.difficulty,
            style: options.style,
            instructions: options.instructions
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

          const result = validateQuiz(parsedData, options.count);
          if (!result.ok) {
            if (result.reason === "NO_VALID_QUESTIONS") {
              setStatus("empty");
              return;
            }
            if (!isRetry) {
              isRetry = true;
              continue;
            }
            setErrorCode("BAD_MODEL_OUTPUT");
            setStatus("error");
            return;
          }

          setQuiz({ title: result.title, questions: result.questions });
          setDroppedCount(result.droppedCount);
          setStatus("ready");
          return;

        } catch (error) {
          if (myId !== requestId.current) return;
          if (error.name === "AbortError") {
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

  return { status, quiz, errorCode, droppedCount, requestedCount, generate, reset };
}

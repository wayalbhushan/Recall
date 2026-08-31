"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "recall_sessions";
const MAX_SESSIONS = 10;

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default function useSessions() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    setSessions(loadFromStorage());
  }, []);

  const saveSession = useCallback((topic, quiz, settings) => {
    const newSession = {
      id: Date.now().toString(),
      savedAt: new Date().toISOString(),
      topic: topic.trim().slice(0, 60),
      quiz,
      settings,
    };
    setSessions((prev) => {
      const updated = [newSession, ...prev].slice(0, MAX_SESSIONS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const deleteSession = useCallback((id) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  return { sessions, saveSession, deleteSession };
}

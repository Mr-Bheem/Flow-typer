"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface TypingState {
  /** The full target text */
  text: string;
  /** Characters typed so far (correct + incorrect) */
  typed: string;
  /** Index of the next character to type */
  currentIndex: number;
  /** Per-character status: "correct" | "incorrect" | "pending" */
  charStatus: ("correct" | "incorrect" | "pending")[];
  /** Whether the user has started typing */
  started: boolean;
  /** Whether the test is finished */
  finished: boolean;
  /** Epoch ms when typing started */
  startTime: number | null;
  /** Epoch ms when typing finished */
  endTime: number | null;
  /** Total keystrokes (including backspaces) */
  totalKeystrokes: number;
  /** Errors made (counted once per wrong keypress, even if corrected) */
  errorsCount: number;
  /** WPM at the current moment */
  currentWpm: number;
  /** Raw WPM (no accuracy penalty) */
  rawWpm: number;
  /** Accuracy percent (0-100) */
  accuracy: number;
  /** Correct characters count */
  correctChars: number;
  /** Incorrect characters count (current state, not historical) */
  incorrectChars: number;
  /** Elapsed time in seconds (live) */
  elapsedSec: number;
}

export interface UseTypingEngineOptions {
  text: string;
  /** Optional time limit in seconds. When set, typing auto-finishes when timer hits 0. */
  timeLimitSec?: number;
  /** Stop typing on first error (forces correction) */
  stopOnError?: boolean;
  /** Callback when typing completes (either finished text or timer expired) */
  onComplete?: (result: TypingResult) => void;
  /** Callback for every keystroke (used for sound feedback) */
  onKeystroke?: (correct: boolean) => void;
}

export interface TypingResult {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  durationSec: number;
  totalChars: number;
  text: string;
}

export function useTypingEngine({
  text,
  timeLimitSec,
  stopOnError = false,
  onComplete,
  onKeystroke,
}: UseTypingEngineOptions) {
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [errorsCount, setErrorsCount] = useState(0);
  const [now, setNow] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep latest onComplete in a ref so the `finish` callback stays stable.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const reset = useCallback(() => {
    setTyped("");
    setStarted(false);
    setFinished(false);
    setStartTime(null);
    setEndTime(null);
    setTotalKeystrokes(0);
    setErrorsCount(0);
    setNow(null);
  }, []);

  const finish = useCallback(() => {
    setFinished(true);
    setEndTime(Date.now());
    setNow(Date.now());
  }, []);

  // Compute and dispatch the final result whenever `finished` flips to true.
  useEffect(() => {
    if (!finished || !startTime) return;
    const end = endTime ?? Date.now();
    const dur = Math.max(0.1, (end - startTime) / 1000);
    const correct = text
      .split("")
      .slice(0, typed.length)
      .filter((c, i) => typed[i] === c).length;
    const finalWpm = Math.max(0, Math.round(correct / 5 / (dur / 60)));
    const finalRawWpm = Math.max(0, Math.round(typed.length / 5 / (dur / 60)));
    const finalAccuracy =
      totalKeystrokes === 0
        ? 100
        : Math.max(
            0,
            Math.round(((totalKeystrokes - errorsCount) / totalKeystrokes) * 100)
          );

    onCompleteRef.current?.({
      wpm: finalWpm,
      rawWpm: finalRawWpm,
      accuracy: finalAccuracy,
      correctChars: correct,
      incorrectChars: typed.length - correct,
      durationSec: dur,
      totalChars: text.length,
      text,
    });
  }, [finished, startTime, endTime, text, typed, totalKeystrokes, errorsCount]);

  // Reset state when text changes
  useEffect(() => {
    reset();
  }, [text]);

  // Tick clock while typing
  useEffect(() => {
    if (!started || finished) return;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [started, finished]);

  // Timer-based completion
  useEffect(() => {
    if (!started || finished || !timeLimitSec || !startTime) return;
    const elapsed = (now ?? Date.now()) - startTime;
    if (elapsed >= timeLimitSec * 1000) {
      finish();
    }
  }, [now, started, finished, timeLimitSec, startTime, finish]);

  const currentIndex = typed.length;
  const charStatus = useMemo(() => {
    const statuses: ("correct" | "incorrect" | "pending")[] = text
      .split("")
      .map((c, i) => {
        if (i >= typed.length) return "pending";
        return typed[i] === c ? "correct" : "incorrect";
      });
    return statuses;
  }, [text, typed]);

  const correctChars = charStatus.filter((s) => s === "correct").length;
  const incorrectChars = charStatus.filter((s) => s === "incorrect").length;

  const elapsedSec = useMemo(() => {
    if (!startTime) return 0;
    const end = endTime ?? now ?? Date.now();
    return Math.max(0, (end - startTime) / 1000);
  }, [startTime, endTime, now]);

  const currentWpm = useMemo(() => {
    if (elapsedSec < 0.1) return 0;
    const minutes = elapsedSec / 60;
    return Math.max(0, Math.round(correctChars / 5 / minutes));
  }, [correctChars, elapsedSec]);

  const rawWpm = useMemo(() => {
    if (elapsedSec < 0.1) return 0;
    const minutes = elapsedSec / 60;
    return Math.max(0, Math.round(typed.length / 5 / minutes));
  }, [typed.length, elapsedSec]);

  const accuracy = useMemo(() => {
    if (totalKeystrokes === 0) return 100;
    const correctKeystrokes = totalKeystrokes - errorsCount;
    return Math.max(0, Math.round((correctKeystrokes / totalKeystrokes) * 100));
  }, [totalKeystrokes, errorsCount]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent) => {
      if (finished) return;

      const key = e.key;

      if (key === "Tab") {
        e.preventDefault();
        return;
      }

      if (key === "Backspace") {
        e.preventDefault();
        setTyped((prev) => prev.slice(0, -1));
        return;
      }

      // Only handle printable single-char keys
      if (key.length !== 1) return;

      e.preventDefault();

      // Don't allow typing beyond text length
      if (typed.length >= text.length) return;

      // stopOnError: if last char is wrong, block further input
      if (
        stopOnError &&
        typed.length > 0 &&
        typed[typed.length - 1] !== text[typed.length - 1]
      ) {
        return;
      }

      // Start the timer on first keystroke
      if (!started) {
        setStarted(true);
        setStartTime(Date.now());
        setNow(Date.now());
      }

      const expectedChar = text[typed.length];
      const isCorrect = key === expectedChar;

      setTotalKeystrokes((prev) => prev + 1);
      if (!isCorrect) {
        setErrorsCount((prev) => prev + 1);
      }
      onKeystroke?.(isCorrect);

      const newTyped = typed + key;
      setTyped(newTyped);

      // Finish if we've typed the whole text
      if (newTyped.length >= text.length) {
        // Defer finish to allow state to commit first
        setTimeout(() => {
          finish();
        }, 0);
      }
    },
    [typed, text, started, finished, stopOnError, onKeystroke, finish]
  );

  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return {
    state: {
      text,
      typed,
      currentIndex,
      charStatus,
      started,
      finished,
      startTime,
      endTime,
      totalKeystrokes,
      errorsCount,
      currentWpm,
      rawWpm,
      accuracy,
      correctChars,
      incorrectChars,
      elapsedSec,
    } as TypingState,
    handleKeyDown,
    reset,
    focus,
    inputRef,
  };
}

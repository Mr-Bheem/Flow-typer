"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PageId =
  | "home"
  | "lessons"
  | "practice"
  | "test"
  | "stats"
  | "settings";

export type ThemeMode = "light" | "dark" | "system";

export interface TypingResult {
  id: string;
  date: number; // epoch ms
  mode: "lesson" | "practice" | "test";
  modeLabel: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  durationSec: number;
  textLength: number;
}

export interface Settings {
  theme: ThemeMode;
  fontSize: "sm" | "md" | "lg" | "xl";
  showKeyboard: boolean;
  showFingers: boolean;
  soundEnabled: boolean;
  smoothCaret: boolean;
  blurWrongKeys: boolean;
  stopOnError: boolean;
  keyboardLayout: "qwerty" | "dvorak";
}

export interface CompletedLesson {
  lessonId: string;
  bestWpm: number;
  bestAccuracy: number;
  attempts: number;
  lastAttempt: number;
}

interface AppState {
  // Navigation
  currentPage: PageId;
  setPage: (page: PageId) => void;

  // Settings
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;

  // History
  history: TypingResult[];
  addResult: (result: Omit<TypingResult, "id" | "date">) => void;
  clearHistory: () => void;

  // Lessons progress
  completedLessons: Record<string, CompletedLesson>;
  recordLessonAttempt: (
    lessonId: string,
    wpm: number,
    accuracy: number
  ) => void;
  resetProgress: () => void;
}

const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  fontSize: "lg",
  showKeyboard: true,
  showFingers: true,
  soundEnabled: false,
  smoothCaret: true,
  blurWrongKeys: false,
  stopOnError: false,
  keyboardLayout: "qwerty",
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentPage: "home",
      setPage: (page) => set({ currentPage: page }),

      settings: DEFAULT_SETTINGS,
      updateSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),

      history: [],
      addResult: (result) =>
        set((state) => ({
          history: [
            ...state.history,
            {
              ...result,
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
              date: Date.now(),
            },
          ].slice(-200), // keep last 200
        })),
      clearHistory: () => set({ history: [] }),

      completedLessons: {},
      recordLessonAttempt: (lessonId, wpm, accuracy) =>
        set((state) => {
          const existing = state.completedLessons[lessonId];
          const updated: CompletedLesson = {
            lessonId,
            bestWpm: existing ? Math.max(existing.bestWpm, wpm) : wpm,
            bestAccuracy: existing
              ? Math.max(existing.bestAccuracy, accuracy)
              : accuracy,
            attempts: existing ? existing.attempts + 1 : 1,
            lastAttempt: Date.now(),
          };
          return {
            completedLessons: {
              ...state.completedLessons,
              [lessonId]: updated,
            },
          };
        }),
      resetProgress: () =>
        set({ completedLessons: {}, history: [] }),
    }),
    {
      name: "typeflow-storage",
    }
  )
);

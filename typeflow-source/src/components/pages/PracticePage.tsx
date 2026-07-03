"use client";

import { useState, useMemo, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { PRACTICE_SETS, type PracticeSet } from "@/lib/practice-texts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypingArea } from "@/components/typing/TypingArea";
import type { TypingResult } from "@/lib/use-typing-engine";
import {
  PenLine,
  Shuffle,
  ChevronLeft,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PracticePage() {
  const [activeSet, setActiveSet] = useState<PracticeSet | null>(null);
  const [textIdx, setTextIdx] = useState(0);
  const [showResult, setShowResult] = useState<TypingResult | null>(null);

  const addResult = useAppStore((s) => s.addResult);

  const currentText = useMemo(() => {
    if (!activeSet) return "";
    return activeSet.texts[textIdx % activeSet.texts.length];
  }, [activeSet, textIdx]);

  const handleComplete = useCallback(
    (result: TypingResult) => {
      if (!activeSet) return;
      addResult({
        mode: "practice",
        modeLabel: `Practice: ${activeSet.title}`,
        wpm: result.wpm,
        rawWpm: result.rawWpm,
        accuracy: result.accuracy,
        correctChars: result.correctChars,
        incorrectChars: result.incorrectChars,
        durationSec: result.durationSec,
        textLength: result.totalChars,
      });
      setShowResult(result);
    },
    [activeSet, addResult]
  );

  const nextText = () => {
    setShowResult(null);
    if (activeSet) {
      setTextIdx((i) => (i + 1) % activeSet.texts.length);
    }
  };

  const randomize = () => {
    if (!activeSet) return;
    setShowResult(null);
    const newIdx = Math.floor(Math.random() * activeSet.texts.length);
    setTextIdx(newIdx);
  };

  // Library view
  if (!activeSet) {
    return (
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Free Practice
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Pick a category and start typing. Each set has multiple texts —
            cycle through them with the Next button or randomize for variety.
            No timer, no pressure.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRACTICE_SETS.map((set) => (
            <PracticeSetCard key={set.id} set={set} onOpen={() => setActiveSet(set)} />
          ))}
        </div>
      </div>
    );
  }

  // Active practice view
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => {
            setActiveSet(null);
            setShowResult(null);
            setTextIdx(0);
          }}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          All categories
        </button>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">{activeSet.title}</span>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                {activeSet.icon}
              </div>
              <div>
                <h2 className="font-bold">{activeSet.title}</h2>
                <p className="text-xs text-muted-foreground">
                  Text {textIdx + 1} of {activeSet.texts.length} ·{" "}
                  <DifficultyBadge level={activeSet.difficulty} />
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={randomize}>
                <Shuffle className="mr-2 h-3.5 w-3.5" />
                Random
              </Button>
              <Button size="sm" variant="outline" onClick={nextText}>
                Next text
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showResult ? (
        <ResultPanel
          result={showResult}
          onNext={nextText}
          onRetry={() => setShowResult(null)}
        />
      ) : (
        <TypingArea
          key={`${activeSet.id}-${textIdx}`}
          text={currentText}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}

function PracticeSetCard({
  set,
  onOpen,
}: {
  set: PracticeSet;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 text-left transition-all hover:border-primary/40 hover:shadow-md"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl font-bold text-primary">
          {set.icon}
        </div>
        <DifficultyBadge level={set.difficulty} />
      </div>
      <h3 className="mb-1 font-bold">{set.title}</h3>
      <p className="mb-4 flex-1 text-sm text-muted-foreground">
        {set.description}
      </p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{set.texts.length} texts</span>
        <span className="inline-flex items-center gap-1 font-medium text-primary">
          Start
          <PenLine className="h-3 w-3" />
        </span>
      </div>
    </button>
  );
}

function DifficultyBadge({ level }: { level: PracticeSet["difficulty"] }) {
  const styles = {
    easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    hard: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  };
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[0.7rem] font-medium capitalize",
        styles[level]
      )}
    >
      {level}
    </span>
  );
}

function ResultPanel({
  result,
  onNext,
  onRetry,
}: {
  result: TypingResult;
  onNext: () => void;
  onRetry: () => void;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
        <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-bold">Nice work!</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You typed {result.correctChars} characters in{" "}
          {result.durationSec.toFixed(1)} seconds.
        </p>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="WPM" value={result.wpm} highlight />
          <Stat label="Accuracy" value={`${result.accuracy}%`} />
          <Stat label="Correct" value={result.correctChars} />
          <Stat label="Errors" value={result.incorrectChars} />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onRetry}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
          <Button onClick={onNext}>
            Next text
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-center">
      <div className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div
        className={cn(
          "mt-1 font-mono text-2xl font-bold tabular-nums",
          highlight ? "text-primary" : "text-foreground"
        )}
      >
        {value}
      </div>
    </div>
  );
}

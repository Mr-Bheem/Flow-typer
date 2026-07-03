"use client";

import { useState, useMemo, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypingArea } from "@/components/typing/TypingArea";
import type { TypingResult } from "@/lib/use-typing-engine";
import { Timer, RotateCcw, CheckCircle2, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const TEST_DURATIONS = [15, 30, 60, 120] as const;
type TestDuration = (typeof TEST_DURATIONS)[number];

const TEST_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what", "so",
  "up", "out", "if", "about", "who", "get", "which", "go", "me", "when",
  "make", "can", "like", "time", "no", "just", "him", "know", "take", "people",
  "into", "year", "your", "good", "some", "could", "them", "see", "other", "than",
  "then", "now", "look", "only", "come", "its", "over", "think", "also", "back",
  "after", "use", "two", "how", "our", "work", "first", "well", "way", "even",
  "new", "want", "because", "any", "these", "give", "day", "most", "us", "great",
];

function generateText(targetLength: number = 600): string {
  const words: string[] = [];
  let total = 0;
  while (total < targetLength) {
    const w = TEST_WORDS[Math.floor(Math.random() * TEST_WORDS.length)];
    words.push(w);
    total += w.length + 1;
  }
  return words.join(" ");
}

export function TestPage() {
  const [duration, setDuration] = useState<TestDuration>(30);
  const [seed, setSeed] = useState(0);
  const [showResult, setShowResult] = useState<TypingResult | null>(null);

  const addResult = useAppStore((s) => s.addResult);
  const history = useAppStore((s) => s.history);

  const testText = useMemo(() => generateText(), [seed]);

  const handleComplete = useCallback(
    (result: TypingResult) => {
      addResult({
        mode: "test",
        modeLabel: `Timed Test (${duration}s)`,
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
    [duration, addResult]
  );

  const restart = () => {
    setShowResult(null);
    setSeed((s) => s + 1);
  };

  // Get best WPM per duration from history
  const bestPerDuration = useMemo(() => {
    const map: Record<number, number> = {};
    for (const r of history) {
      if (r.mode !== "test") continue;
      const m = r.modeLabel.match(/\((\d+)s\)/);
      if (!m) continue;
      const d = Number(m[1]);
      map[d] = Math.max(map[d] ?? 0, r.wpm);
    }
    return map;
  }, [history]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Timed Typing Test
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Race against the clock. Pick a duration, focus, and try to type as
          many words as you can. Your WPM and accuracy are recorded to your
          stats page.
        </p>
      </header>

      {/* Duration picker */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              <span className="font-medium">Test duration</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TEST_DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDuration(d);
                    restart();
                  }}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                    duration === d
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card hover:bg-muted"
                  )}
                >
                  {d}s
                  {bestPerDuration[d] && (
                    <span className="ml-2 text-xs opacity-80">
                      best {bestPerDuration[d]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test area / result */}
      {showResult ? (
        <TestResult
          result={showResult}
          duration={duration}
          bestWpm={bestPerDuration[duration] ?? 0}
          onRestart={restart}
        />
      ) : (
        <>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="font-medium">Timer starts on your first keystroke.</span>
            </div>
            <p className="mt-1 text-muted-foreground">
              You have {duration} seconds. Type as much of the text below as you can.
              The test ends automatically when time is up.
            </p>
          </div>

          <TypingArea
            key={`${duration}-${seed}`}
            text={testText}
            timeLimitSec={duration}
            onComplete={handleComplete}
            showKeyboard={false}
          />
        </>
      )}

      {/* Tip */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h3 className="mb-2 font-semibold">Tips for a faster WPM</h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">Look ahead.</strong> Don't
                watch your fingers; let your eyes stay a few words ahead of
                where you're typing.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">Prioritize accuracy.</strong>{" "}
                Speed comes from not having to backspace. Aim for 95%+ accuracy
                before pushing for speed.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">Stay relaxed.</strong>{" "}
                Tension slows you down. Keep your shoulders, wrists, and fingers
                loose.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">Practice daily.</strong>{" "}
                Just 10 minutes a day beats 70 minutes once a week. Consistency
                builds muscle memory.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function TestResult({
  result,
  duration,
  bestWpm,
  onRestart,
}: {
  result: TypingResult;
  duration: number;
  bestWpm: number;
  onRestart: () => void;
}) {
  const isNewBest = result.wpm >= bestWpm && result.wpm > 0;

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8 text-center">
        {isNewBest && (
          <div className="mx-auto mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            <Trophy className="h-3 w-3" />
            New personal best!
          </div>
        )}
        <div className="mx-auto mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Timer className="h-8 w-8" />
        </div>
        <div className="font-mono text-5xl font-bold tabular-nums text-primary sm:text-6xl">
          {result.wpm}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          Words per minute · {duration}s test
        </div>
      </div>

      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Accuracy" value={`${result.accuracy}%`} highlight />
          <Stat label="Raw WPM" value={result.rawWpm} />
          <Stat label="Correct" value={result.correctChars} />
          <Stat label="Errors" value={result.incorrectChars} />
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onRestart} size="lg">
            <RotateCcw className="mr-2 h-4 w-4" />
            Test again
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

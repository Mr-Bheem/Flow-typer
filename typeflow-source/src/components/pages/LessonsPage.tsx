"use client";

import { useState, useMemo, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import {
  CURRICULUM,
  getUnits,
  getLessonById,
  getNextLesson,
  getPrevLesson,
  type Lesson,
} from "@/lib/curriculum";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypingArea } from "@/components/typing/TypingArea";
import type { TypingResult } from "@/lib/use-typing-engine";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Circle,
  Target,
  Info,
  Award,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type View = "list" | "lesson";

export function LessonsPage() {
  const [view, setView] = useState<View>("list");
  const [activeLessonId, setActiveLessonId] = useState<string>(CURRICULUM[0].id);

  const completedLessons = useAppStore((s) => s.completedLessons);

  const openLesson = (id: string) => {
    setActiveLessonId(id);
    setView("lesson");
  };

  if (view === "lesson") {
    return (
      <LessonView
        lessonId={activeLessonId}
        onBack={() => setView("list")}
        onNavigate={(id) => openLesson(id)}
      />
    );
  }

  return (
    <LessonsList
      completedLessons={completedLessons}
      onOpen={openLesson}
    />
  );
}

function LessonsList({
  completedLessons,
  onOpen,
}: {
  completedLessons: Record<string, { bestWpm: number; bestAccuracy: number }>;
  onOpen: (id: string) => void;
}) {
  const units = getUnits();
  const totalCompleted = Object.keys(completedLessons).length;
  const totalLessons = CURRICULUM.length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Step-by-Step Lessons
        </h1>
        <p className="mt-2 text-muted-foreground">
          Work through {totalLessons} guided lessons across {units.length} units.
          Each lesson introduces new keys, drills them, and ends with a challenge.
        </p>

        <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Curriculum progress</span>
              <span className="font-mono font-medium text-foreground">
                {totalCompleted} / {totalLessons} ({Math.round((totalCompleted / totalLessons) * 100)}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${(totalCompleted / totalLessons) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-8">
        {units.map((unit) => {
          const unitDone = unit.lessons.filter((l) => completedLessons[l.id]).length;
          return (
            <section key={unit.unit}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <span className="font-bold">{unit.unit}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{unit.unitTitle}</h2>
                  <p className="text-xs text-muted-foreground">
                    {unitDone} of {unit.lessons.length} lessons complete
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {unit.lessons.map((lesson, idx) => {
                  const done = completedLessons[lesson.id];
                  const globalIdx = CURRICULUM.findIndex((l) => l.id === lesson.id);
                  const isLocked =
                    globalIdx > 0 &&
                    !completedLessons[CURRICULUM[globalIdx - 1].id] &&
                    idx > 0;
                  return (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      done={done}
                      locked={isLocked}
                      onOpen={() => onOpen(lesson.id)}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function LessonCard({
  lesson,
  done,
  locked,
  onOpen,
}: {
  lesson: Lesson;
  done?: { bestWpm: number; bestAccuracy: number };
  locked: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      disabled={locked}
      className={cn(
        "group flex h-full flex-col rounded-xl border bg-card p-4 text-left transition-all",
        locked
          ? "cursor-not-allowed border-border opacity-50"
          : "border-border hover:border-primary/40 hover:shadow-md"
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        {done ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.7rem] font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[0.7rem] font-medium text-muted-foreground">
            <Circle className="h-3 w-3" />
            Not started
          </span>
        )}
        <span className="text-[0.7rem] text-muted-foreground">
          Target {lesson.targetWpm} WPM
        </span>
      </div>
      <h3 className="mb-1 font-semibold leading-tight">{lesson.title}</h3>
      <p className="line-clamp-2 text-xs text-muted-foreground">
        {lesson.description}
      </p>
      {done && (
        <div className="mt-3 flex items-center gap-3 text-[0.7rem] text-muted-foreground">
          <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
            {done.bestWpm} WPM
          </span>
          <span className="font-mono font-semibold">{done.bestAccuracy}%</span>
        </div>
      )}
      {!locked && (
        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
          Start lesson
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </div>
      )}
    </button>
  );
}

function LessonView({
  lessonId,
  onBack,
  onNavigate,
}: {
  lessonId: string;
  onBack: () => void;
  onNavigate: (id: string) => void;
}) {
  const lesson = getLessonById(lessonId)!;
  const prev = getPrevLesson(lessonId);
  const next = getNextLesson(lessonId);
  const [activeDrillIdx, setActiveDrillIdx] = useState(0);
  const [phase, setPhase] = useState<"drill" | "challenge">("drill");
  const [showResult, setShowResult] = useState<{
    result: TypingResult;
    passed: boolean;
  } | null>(null);

  const recordLessonAttempt = useAppStore((s) => s.recordLessonAttempt);
  const addResult = useAppStore((s) => s.addResult);

  const activeText = useMemo(() => {
    if (phase === "challenge") return lesson.challenge;
    return lesson.drills[activeDrillIdx] ?? "";
  }, [lesson, phase, activeDrillIdx]);

  const handleComplete = useCallback(
    (result: TypingResult) => {
      const passed = result.wpm >= lesson.targetWpm && result.accuracy >= 90;

      // Always record an attempt
      recordLessonAttempt(lesson.id, result.wpm, result.accuracy);
      addResult({
        mode: "lesson",
        modeLabel: `Lesson: ${lesson.title}`,
        wpm: result.wpm,
        rawWpm: result.rawWpm,
        accuracy: result.accuracy,
        correctChars: result.correctChars,
        incorrectChars: result.incorrectChars,
        durationSec: result.durationSec,
        textLength: result.totalChars,
      });

      setShowResult({ result, passed });
    },
    [lesson, recordLessonAttempt, addResult]
  );

  const advance = () => {
    setShowResult(null);
    if (phase === "drill" && activeDrillIdx < lesson.drills.length - 1) {
      setActiveDrillIdx((i) => i + 1);
    } else if (phase === "drill") {
      setPhase("challenge");
    } else {
      // challenge done
      if (next) onNavigate(next.id);
      else onBack();
    }
  };

  const retry = () => {
    setShowResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          All lessons
        </button>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">Unit {lesson.unit}</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">{lesson.title}</span>
      </div>

      {/* Lesson header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Unit {lesson.unit} · {lesson.unitTitle}
              </div>
              <CardTitle className="text-2xl">{lesson.title}</CardTitle>
              <CardDescription className="mt-2 max-w-2xl">
                {lesson.description}
              </CardDescription>
            </div>
            <div className="hidden shrink-0 items-center gap-2 rounded-lg border border-border bg-muted/30 p-3 sm:flex">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <div className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                  Target
                </div>
                <div className="font-mono font-bold">{lesson.targetWpm} WPM</div>
              </div>
            </div>
          </div>

          {lesson.keysIntroduced.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Keys introduced:</span>
              {lesson.keysIntroduced.map((k) => (
                <kbd
                  key={k}
                  className="inline-flex h-7 min-w-7 items-center justify-center rounded border border-primary/30 bg-primary/10 px-2 font-mono text-sm font-semibold text-primary"
                >
                  {k === "shift" ? "Shift" : k === " " ? "Space" : k.toUpperCase()}
                </kbd>
              ))}
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Phase indicator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {lesson.drills.map((_, idx) => (
          <PhaseDot
            key={`d${idx}`}
            active={phase === "drill" && activeDrillIdx === idx}
            done={phase === "challenge" || (phase === "drill" && activeDrillIdx > idx)}
            label={`Drill ${idx + 1}`}
          />
        ))}
        <PhaseDot
          active={phase === "challenge"}
          done={false}
          label="Challenge"
          isChallenge
        />
      </div>

      {/* Result overlay */}
      {showResult ? (
        <ResultCard
          result={showResult.result}
          passed={showResult.passed}
          targetWpm={lesson.targetWpm}
          isChallenge={phase === "challenge"}
          hasNext={!!next}
          onAdvance={advance}
          onRetry={retry}
        />
      ) : (
        <>
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm">
              <Info className="h-4 w-4 text-primary" />
              <span className="font-medium">
                {phase === "drill"
                  ? `Drill ${activeDrillIdx + 1} of ${lesson.drills.length}`
                  : "Final Challenge"}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">
                {phase === "challenge"
                  ? "Type the full challenge to complete this lesson."
                  : "Type the drill line below. Take your time and focus on accuracy."}
              </span>
            </div>
          </div>

          <TypingArea
            key={`${lesson.id}-${phase}-${activeDrillIdx}`}
            text={activeText}
            introducedKeys={lesson.keysIntroduced}
            onComplete={handleComplete}
          />
        </>
      )}

      {/* Footer nav */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to lessons
        </Button>
        <div className="flex gap-2">
          {prev && (
            <Button variant="outline" onClick={() => onNavigate(prev.id)}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          )}
          {next && (
            <Button variant="outline" onClick={() => onNavigate(next.id)}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function PhaseDot({
  active,
  done,
  label,
  isChallenge,
}: {
  active: boolean;
  done: boolean;
  label: string;
  isChallenge?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : done
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "border-border bg-card text-muted-foreground"
      )}
    >
      {done ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : isChallenge ? (
        <Award className="h-3 w-3" />
      ) : (
        <span className="font-mono">{label}</span>
      )}
      {(isChallenge || active) && (
        <span className="font-medium">{label}</span>
      )}
    </div>
  );
}

function ResultCard({
  result,
  passed,
  targetWpm,
  isChallenge,
  hasNext,
  onAdvance,
  onRetry,
}: {
  result: TypingResult;
  passed: boolean;
  targetWpm: number;
  isChallenge: boolean;
  hasNext: boolean;
  onAdvance: () => void;
  onRetry: () => void;
}) {
  return (
    <Card className="overflow-hidden">
      <div
        className={cn(
          "border-b p-6 text-center",
          passed
            ? "border-emerald-500/20 bg-emerald-500/5"
            : "border-amber-500/20 bg-amber-500/5"
        )}
      >
        <div
          className={cn(
            "mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full",
            passed
              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
          )}
        >
          {passed ? (
            <CheckCircle2 className="h-7 w-7" />
          ) : (
            <RotateCcw className="h-7 w-7" />
          )}
        </div>
        <h2 className="text-2xl font-bold">
          {passed
            ? isChallenge
              ? "Lesson complete!"
              : "Drill complete!"
            : "Keep practicing"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {passed
            ? `You hit ${result.wpm} WPM with ${result.accuracy}% accuracy.`
            : `You need ${targetWpm} WPM at 90%+ accuracy to pass. You got ${result.wpm} WPM at ${result.accuracy}%.`}
        </p>
      </div>

      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <ResultStat label="WPM" value={result.wpm} highlight />
          <ResultStat label="Accuracy" value={`${result.accuracy}%`} highlight={result.accuracy >= 90} />
          <ResultStat label="Correct" value={result.correctChars} />
          <ResultStat label="Errors" value={result.incorrectChars} />
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onRetry}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          {passed && (
            <Button onClick={onAdvance}>
              {isChallenge
                ? hasNext
                  ? "Next lesson"
                  : "Back to lessons"
                : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ResultStat({
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

"use client";

import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { useTypingEngine, type TypingResult } from "@/lib/use-typing-engine";
import { useAppStore } from "@/lib/store";
import { VirtualKeyboard } from "./VirtualKeyboard";

interface TypingAreaProps {
  text: string;
  timeLimitSec?: number;
  onComplete?: (result: TypingResult) => void;
  /** Show the virtual keyboard below the typing area */
  showKeyboard?: boolean;
  /** Keys introduced in this lesson (for keyboard highlight) */
  introducedKeys?: string[];
  /** Hide stats bar (e.g. when external stats bar is used) */
  hideStats?: boolean;
  /** Render text container class */
  textClassName?: string;
}

const FONT_SIZE_CLASSES: Record<string, string> = {
  sm: "text-lg sm:text-xl",
  md: "text-xl sm:text-2xl",
  lg: "text-2xl sm:text-3xl",
  xl: "text-3xl sm:text-4xl",
};

export function TypingArea({
  text,
  timeLimitSec,
  onComplete,
  showKeyboard = true,
  introducedKeys,
  hideStats = false,
  textClassName,
}: TypingAreaProps) {
  const settings = useAppStore((s) => s.settings);

  // Keep latest onComplete in a ref so the engine doesn't need to re-init on every render
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const handleComplete = useMemo(
    () => (result: TypingResult) => onCompleteRef.current?.(result),
    []
  );

  const {
    state,
    handleKeyDown,
    reset,
    focus,
    inputRef,
  } = useTypingEngine({
    text,
    timeLimitSec,
    stopOnError: settings.stopOnError,
    onComplete: handleComplete,
  });

  // Auto-focus on mount and on text change
  useEffect(() => {
    const t = setTimeout(() => focus(), 50);
    return () => clearTimeout(t);
  }, [focus, text]);

  const nextChar = useMemo(() => {
    if (state.finished) return undefined;
    return text[state.currentIndex];
  }, [text, state.currentIndex, state.finished]);

  const fontSizeClass = FONT_SIZE_CLASSES[settings.fontSize] ?? FONT_SIZE_CLASSES.lg;

  return (
    <div className="w-full">
      {/* Hidden input that captures keystrokes */}
      <input
        ref={inputRef}
        type="text"
        value=""
        onChange={() => {}}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          // Re-focus on next tick if not finished
          if (!state.finished) {
            setTimeout(() => focus(), 0);
          }
        }}
        className="absolute opacity-0 pointer-events-none -z-10 h-0 w-0"
        aria-label="Typing input"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      {/* Click-to-focus surface */}
      <div
        onClick={focus}
        role="textbox"
        tabIndex={0}
        aria-label="Type here. Click to focus."
        className={cn(
          "typing-focus-ring relative w-full cursor-text rounded-2xl border bg-card p-6 shadow-sm transition-colors sm:p-8",
          state.finished ? "border-primary/40" : "border-border hover:border-primary/40",
          textClassName
        )}
      >
        {/* Live stats overlay (top-right) */}
        {!hideStats && (
          <div className="mb-4 flex flex-wrap items-center justify-end gap-3 text-sm">
            <Stat label="WPM" value={state.currentWpm} highlight />
            <Stat label="Accuracy" value={`${state.accuracy}%`} />
            <Stat
              label="Time"
              value={
                timeLimitSec
                  ? `${Math.max(0, Math.ceil(timeLimitSec - state.elapsedSec))}s`
                  : `${state.elapsedSec.toFixed(1)}s`
              }
            />
          </div>
        )}

        {/* The text surface */}
        <div
          className={cn(
            "font-mono leading-relaxed tracking-wide",
            fontSizeClass
          )}
          style={{ minHeight: "6em" }}
        >
          <TextRender
            text={text}
            charStatus={state.charStatus}
            currentIndex={state.currentIndex}
            finished={state.finished}
            smoothCaret={settings.smoothCaret}
            blurWrongKeys={settings.blurWrongKeys}
          />
        </div>

        {/* Status indicator */}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Correct
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Incorrect
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Cursor
            </span>
          </div>
          <div className="hidden sm:block">
            {state.finished ? (
              <span className="text-primary font-medium">Completed</span>
            ) : state.started ? (
              <span>Keep typing…</span>
            ) : (
              <span>Click here and start typing</span>
            )}
          </div>
        </div>
      </div>

      {showKeyboard && settings.showKeyboard && (
        <div className="mt-6">
          <VirtualKeyboard
            nextChar={nextChar}
            showFingers={settings.showFingers}
            introducedKeys={introducedKeys ?? []}
          />
        </div>
      )}

      {/* Reset / restart row */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={() => {
            reset();
            setTimeout(() => focus(), 0);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground shadow-sm transition-colors hover:bg-muted"
        >
          ↻ Restart
        </button>
        <span className="text-xs text-muted-foreground">
          Press <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">Backspace</kbd> to correct
        </span>
      </div>
    </div>
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
    <div className="flex flex-col items-end">
      <span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "font-mono text-lg font-semibold tabular-nums",
          highlight ? "text-primary" : "text-foreground"
        )}
      >
        {value}
      </span>
    </div>
  );
}

interface TextRenderProps {
  text: string;
  charStatus: ("correct" | "incorrect" | "pending")[];
  currentIndex: number;
  finished: boolean;
  smoothCaret: boolean;
  blurWrongKeys: boolean;
}

function TextRender({
  text,
  charStatus,
  currentIndex,
  finished,
  blurWrongKeys,
}: TextRenderProps) {
  const chars = text.split("");

  return (
    <div className="flex flex-wrap break-words">
      {chars.map((char, i) => {
        const status = charStatus[i];
        const isCurrent = i === currentIndex && !finished;
        const isSpace = char === " ";
        const isLineStart = i > 0 && text[i - 1] === "\n";

        return (
          <span
            key={i}
            className={cn(
              "relative inline-block transition-colors duration-100",
              isLineStart && "ml-0",
              status === "correct" && "text-foreground",
              status === "incorrect" && [
                "text-red-500 dark:text-red-400",
                isSpace && "bg-red-500/20 rounded",
                blurWrongKeys && "blur-[1px]",
              ],
              status === "pending" && "text-muted-foreground/40",
              isCurrent && "rounded-sm"
            )}
          >
            {isCurrent && (
              <span
                className="caret-blink absolute left-0 top-0 h-full w-[2px] bg-primary"
                aria-hidden
              />
            )}
            {isSpace ? "\u00A0" : char}
          </span>
        );
      })}
      {currentIndex >= text.length && !finished && (
        <span className="caret-blink inline-block w-[2px] bg-primary" style={{ height: "1.2em" }} />
      )}
    </div>
  );
}

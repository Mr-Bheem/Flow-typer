"use client";

import { cn } from "@/lib/utils";
import {
  QWERTY_ROWS,
  FINGER_COLORS,
  getKeyForChar,
  type KeyInfo,
} from "@/lib/keyboard-layout";

interface VirtualKeyboardProps {
  /** The next character the user should press (used for highlighting) */
  nextChar?: string;
  /** Whether to color keys by finger */
  showFingers?: boolean;
  /** Highlight keys introduced in the current lesson */
  introducedKeys?: string[];
  className?: string;
}

export function VirtualKeyboard({
  nextChar,
  showFingers = true,
  introducedKeys = [],
  className,
}: VirtualKeyboardProps) {
  const targetKey = nextChar ? getKeyForChar(nextChar) : null;

  return (
    <div
      className={cn(
        "w-full select-none rounded-2xl bg-muted/40 p-3 sm:p-4",
        className
      )}
    >
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {QWERTY_ROWS.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="flex justify-center gap-1 sm:gap-1.5"
            style={{
              marginLeft: `${rowIdx * 0.5}rem`,
              marginRight: `${rowIdx * 0.5}rem`,
            }}
          >
            {rowIdx === 3 && (
              <KeyCap
                label="Shift"
                width={2.5}
                variant={targetKey?.isShifted ? "active" : "default"}
                colorGroup={1}
                showFingers={showFingers}
              />
            )}
            {row.map((key) => {
              const isNext = targetKey?.key?.main === key.main;
              const isIntroduced = introducedKeys.includes(key.main);
              return (
                <KeyCap
                  key={key.main}
                  main={key.main}
                  shifted={key.shifted}
                  colorGroup={key.colorGroup}
                  width={1}
                  variant={isNext ? "next" : isIntroduced ? "introduced" : "default"}
                  showFingers={showFingers}
                />
              );
            })}
            {rowIdx === 3 && (
              <KeyCap
                label="Shift"
                width={2.5}
                variant={targetKey?.isShifted ? "active" : "default"}
                colorGroup={8}
                showFingers={showFingers}
              />
            )}
          </div>
        ))}
        {/* Space row */}
        <div className="flex justify-center gap-1.5">
          <KeyCap
            label="Space"
            width={12}
            variant={targetKey?.key?.main === " " ? "next" : "default"}
            colorGroup={4}
            showFingers={showFingers}
          />
        </div>
      </div>
    </div>
  );
}

interface KeyCapProps {
  main?: string;
  shifted?: string;
  label?: string;
  width?: number;
  colorGroup: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  variant?: "default" | "next" | "active" | "introduced";
  showFingers?: boolean;
}

function KeyCap({
  main,
  shifted,
  label,
  width = 1,
  colorGroup,
  variant = "default",
  showFingers = true,
}: KeyCapProps) {
  const fingerColor = FINGER_COLORS[colorGroup];

  const displayLabel = label ?? (shifted && shifted.length === 1 ? shifted : main);

  return (
    <div
      className={cn(
        "relative flex h-9 items-center justify-center rounded-md border text-xs font-medium transition-all sm:h-12 sm:text-sm",
        "shadow-[0_1px_0_rgba(0,0,0,0.08)] dark:shadow-[0_1px_0_rgba(0,0,0,0.3)]",
        variant === "next" &&
          "scale-110 border-primary bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/40 z-10",
        variant === "active" &&
          "border-primary bg-primary/20 text-primary",
        variant === "introduced" &&
          "border-primary/40 bg-primary/10 text-primary",
        variant === "default" &&
          "border-border bg-card text-card-foreground"
      )}
      style={{
        width: `calc(${width} * (1.5rem + 0.25rem))`,
        minWidth: `calc(${width} * (1.5rem + 0.25rem))`,
      }}
    >
      {showFingers && variant === "default" && (
        <span
          className="absolute left-0 top-0 h-1 w-full rounded-t-md opacity-70"
          style={{ backgroundColor: fingerColor }}
        />
      )}
      <span className="leading-none">{label ?? displayLabel}</span>
      {shifted && !label && shifted !== main && (
        <span className="absolute right-1 top-0.5 text-[0.5rem] text-muted-foreground sm:text-[0.65rem]">
          {shifted}
        </span>
      )}
    </div>
  );
}

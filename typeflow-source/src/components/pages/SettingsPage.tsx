"use client";

import { useAppStore, type Settings } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Monitor,
  Type,
  Keyboard,
  Volume2,
  Eye,
  Zap,
  AlertTriangle,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FONT_SIZE_OPTIONS: { value: Settings["fontSize"]; label: string; preview: string }[] = [
  { value: "sm", label: "Small", preview: "Aa" },
  { value: "md", label: "Medium", preview: "Aa" },
  { value: "lg", label: "Large", preview: "Aa" },
  { value: "xl", label: "X-Large", preview: "Aa" },
];

export function SettingsPage() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const resetProgress = useAppStore((s) => s.resetProgress);
  const clearHistory = useAppStore((s) => s.clearHistory);
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Customize your typing experience. Settings are saved automatically to
          your browser.
        </p>
      </header>

      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sun className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Choose your preferred color theme. System matches your OS setting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <ThemeOption
              active={theme === "light"}
              onClick={() => setTheme("light")}
              icon={<Sun className="h-5 w-5" />}
              label="Light"
            />
            <ThemeOption
              active={theme === "dark"}
              onClick={() => setTheme("dark")}
              icon={<Moon className="h-5 w-5" />}
              label="Dark"
            />
            <ThemeOption
              active={theme === "system"}
              onClick={() => setTheme("system")}
              icon={<Monitor className="h-5 w-5" />}
              label="System"
            />
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Type className="h-5 w-5" />
            Typography
          </CardTitle>
          <CardDescription>
            Adjust the size of the text you type. Larger text is easier on the
            eyes; smaller text fits more on screen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {FONT_SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateSettings({ fontSize: opt.value })}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                  settings.fontSize === opt.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <span
                  className={cn(
                    "font-mono font-bold",
                    opt.value === "sm" && "text-base",
                    opt.value === "md" && "text-xl",
                    opt.value === "lg" && "text-2xl",
                    opt.value === "xl" && "text-3xl"
                  )}
                >
                  {opt.preview}
                </span>
                <span className="text-xs font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Keyboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Keyboard className="h-5 w-5" />
            Keyboard & Feedback
          </CardTitle>
          <CardDescription>
            Control the on-screen keyboard and visual feedback during typing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <ToggleRow
            icon={<Keyboard className="h-4 w-4" />}
            title="Show virtual keyboard"
            description="Display an on-screen keyboard that highlights the next key."
            checked={settings.showKeyboard}
            onChange={(v) => updateSettings({ showKeyboard: v })}
          />
          <ToggleRow
            icon={<Eye className="h-4 w-4" />}
            title="Color keys by finger"
            description="Use color-coded keycaps to show which finger should press each key."
            checked={settings.showFingers}
            onChange={(v) => updateSettings({ showFingers: v })}
          />
          <ToggleRow
            icon={<Zap className="h-4 w-4" />}
            title="Smooth caret"
            description="Show a smooth blinking caret at the current position."
            checked={settings.smoothCaret}
            onChange={(v) => updateSettings({ smoothCaret: v })}
          />
          <ToggleRow
            icon={<Eye className="h-4 w-4" />}
            title="Blur wrong keys"
            description="Apply a subtle blur to incorrect characters for visual emphasis."
            checked={settings.blurWrongKeys}
            onChange={(v) => updateSettings({ blurWrongKeys: v })}
          />
          <ToggleRow
            icon={<Volume2 className="h-4 w-4" />}
            title="Sound feedback"
            description="Play a soft click sound on each keystroke (coming soon)."
            checked={settings.soundEnabled}
            onChange={(v) => updateSettings({ soundEnabled: v })}
          />
          <ToggleRow
            icon={<AlertTriangle className="h-4 w-4" />}
            title="Stop on error"
            description="Block further typing until you correct the wrong character. Great for accuracy drills."
            checked={settings.stopOnError}
            onChange={(v) => updateSettings({ stopOnError: v })}
          />
        </CardContent>
      </Card>

      {/* Data management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trash2 className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Your typing history and lesson progress are stored locally in your
            browser. Clear them to start fresh.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center">
            <div>
              <div className="font-medium">Clear typing history</div>
              <div className="text-sm text-muted-foreground">
                Remove all recorded typing sessions. Lessons progress is kept.
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                if (confirm("Clear all typing history?")) clearHistory();
              }}
              className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear history
            </Button>
          </div>
          <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center">
            <div>
              <div className="font-medium">Reset all progress</div>
              <div className="text-sm text-muted-foreground">
                Clear all lesson completions and typing history. Cannot be undone.
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                if (
                  confirm(
                    "Reset ALL progress (lessons + history)? This cannot be undone."
                  )
                ) {
                  resetProgress();
                }
              }}
              className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset all
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h3 className="font-semibold">About TypeFlow</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            TypeFlow is a free, browser-based typing tutor built with Next.js,
            React, and Tailwind CSS. All your data stays in your browser —
            nothing is sent to a server. Practice a little every day, and
            you'll be touch-typing before you know it.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ThemeOption({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
        active
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card hover:border-primary/40"
      )}
    >
      <span className={cn(active ? "text-primary" : "text-muted-foreground")}>
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function ToggleRow({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0 last:pb-0">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          {icon}
        </span>
        <div>
          <div className="font-medium leading-tight">{title}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import {
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Trash2,
  Award,
  Keyboard,
} from "lucide-react";

export function StatsPage() {
  const history = useAppStore((s) => s.history);
  const completedLessons = useAppStore((s) => s.completedLessons);
  const clearHistory = useAppStore((s) => s.clearHistory);

  const stats = useMemo(() => {
    if (history.length === 0) {
      return {
        bestWpm: 0,
        avgWpm: 0,
        avgAccuracy: 0,
        totalPracticeSec: 0,
        totalChars: 0,
        totalErrors: 0,
      };
    }
    return {
      bestWpm: Math.max(...history.map((h) => h.wpm)),
      avgWpm: Math.round(
        history.reduce((s, h) => s + h.wpm, 0) / history.length
      ),
      avgAccuracy: Math.round(
        history.reduce((s, h) => s + h.accuracy, 0) / history.length
      ),
      totalPracticeSec: history.reduce((s, h) => s + h.durationSec, 0),
      totalChars: history.reduce((s, h) => s + h.correctChars, 0),
      totalErrors: history.reduce((s, h) => s + h.incorrectChars, 0),
    };
  }, [history]);

  // WPM over time chart
  const trendData = useMemo(() => {
    return [...history]
      .slice(-30)
      .map((h, i) => ({
        idx: i + 1,
        wpm: h.wpm,
        accuracy: h.accuracy,
        date: new Date(h.date).toLocaleDateString(),
        mode: h.modeLabel,
      }));
  }, [history]);

  // By mode breakdown
  const modeBreakdown = useMemo(() => {
    const map: Record<string, { count: number; totalWpm: number; totalAcc: number }> = {};
    for (const h of history) {
      const key = h.mode;
      if (!map[key]) map[key] = { count: 0, totalWpm: 0, totalAcc: 0 };
      map[key].count += 1;
      map[key].totalWpm += h.wpm;
      map[key].totalAcc += h.accuracy;
    }
    return Object.entries(map).map(([mode, v]) => ({
      mode: mode === "lesson" ? "Lessons" : mode === "practice" ? "Practice" : "Tests",
      count: v.count,
      avgWpm: Math.round(v.totalWpm / v.count),
      avgAcc: Math.round(v.totalAcc / v.count),
    }));
  }, [history]);

  const completedCount = Object.keys(completedLessons).length;

  if (history.length === 0 && completedCount === 0) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your Stats</h1>
          <p className="mt-2 text-muted-foreground">
            Track your WPM, accuracy, and lesson progress over time.
          </p>
        </header>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold">No data yet</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Complete a lesson, practice round, or timed test to start
              building your stats. Your results will appear here with charts
              and trends.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your Stats</h1>
          <p className="mt-2 text-muted-foreground">
            {history.length} sessions · {Math.round(stats.totalPracticeSec / 60)} min total practice
          </p>
        </div>
        {history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm("Clear all typing history? This cannot be undone.")) {
                clearHistory();
              }
            }}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Clear history
          </Button>
        )}
      </header>

      {/* Top tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          icon={<Trophy className="h-4 w-4" />}
          label="Best WPM"
          value={stats.bestWpm}
          accent="primary"
        />
        <StatTile
          icon={<TrendingUp className="h-4 w-4" />}
          label="Avg WPM"
          value={stats.avgWpm}
          accent="emerald"
        />
        <StatTile
          icon={<Target className="h-4 w-4" />}
          label="Avg Accuracy"
          value={`${stats.avgAccuracy}%`}
          accent="amber"
        />
        <StatTile
          icon={<Clock className="h-4 w-4" />}
          label="Practice Time"
          value={`${Math.round(stats.totalPracticeSec / 60)}m`}
          accent="rose"
        />
      </div>

      {/* WPM trend */}
      {trendData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">WPM & Accuracy Trend</CardTitle>
            <CardDescription>
              Last {trendData.length} typing sessions (most recent on the right).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="idx"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.5rem",
                      fontSize: "0.85rem",
                    }}
                    labelStyle={{ color: "var(--foreground)" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="wpm"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "var(--primary)" }}
                    activeDot={{ r: 5 }}
                    name="WPM"
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="oklch(0.7 0.15 80)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Accuracy"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mode breakdown */}
      {modeBreakdown.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">By Activity Type</CardTitle>
              <CardDescription>
                Average performance across lessons, practice, and tests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modeBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="mode"
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.5rem",
                        fontSize: "0.85rem",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="avgWpm" name="Avg WPM" radius={[4, 4, 0, 0]}>
                      {modeBreakdown.map((_, i) => (
                        <Cell key={i} fill="var(--primary)" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {modeBreakdown.map((m) => (
                  <div key={m.mode} className="rounded-lg border border-border bg-card p-3 text-center">
                    <div className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                      {m.mode}
                    </div>
                    <div className="mt-1 font-mono text-xl font-bold">{m.avgAcc}%</div>
                    <div className="text-[0.7rem] text-muted-foreground">avg accuracy</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lesson progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5 text-primary" />
                Lesson Progress
              </CardTitle>
              <CardDescription>
                Best WPM for each completed lesson.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(completedLessons).length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center text-center text-sm text-muted-foreground">
                  <Keyboard className="mb-2 h-8 w-8 opacity-50" />
                  No lessons completed yet.
                </div>
              ) : (
                <div className="max-h-72 space-y-1.5 overflow-y-auto custom-scroll pr-2">
                  {Object.values(completedLessons)
                    .sort((a, b) => b.bestWpm - a.bestWpm)
                    .slice(0, 12)
                    .map((l) => (
                      <div
                        key={l.lessonId}
                        className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                          {l.lessonId.split("-")[1]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">
                            Lesson {l.lessonId.split("-")[1]}
                          </div>
                          <div className="text-[0.7rem] text-muted-foreground">
                            {l.attempts} attempt{l.attempts !== 1 ? "s" : ""}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-primary">
                            {l.bestWpm}
                          </div>
                          <div className="text-[0.7rem] text-muted-foreground">WPM</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-medium">
                            {l.bestAccuracy}%
                          </div>
                          <div className="text-[0.7rem] text-muted-foreground">acc</div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent sessions table */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Sessions</CardTitle>
            <CardDescription>
              Your last {Math.min(history.length, 20)} typing sessions.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto custom-scroll">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/50 backdrop-blur">
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Activity</th>
                    <th className="px-4 py-2.5 text-right font-medium">WPM</th>
                    <th className="px-4 py-2.5 text-right font-medium">Accuracy</th>
                    <th className="hidden px-4 py-2.5 text-right font-medium sm:table-cell">Errors</th>
                    <th className="hidden px-4 py-2.5 text-right font-medium sm:table-cell">When</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[...history].slice(-20).reverse().map((r) => (
                    <tr key={r.id} className="hover:bg-muted/30">
                      <td className="px-4 py-2.5">
                        <div className="font-medium">{r.modeLabel}</div>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="font-mono font-semibold text-primary">
                          {r.wpm}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono">
                        {r.accuracy}%
                      </td>
                      <td className="hidden px-4 py-2.5 text-right font-mono sm:table-cell">
                        {r.incorrectChars}
                      </td>
                      <td className="hidden px-4 py-2.5 text-right text-muted-foreground sm:table-cell">
                        {new Date(r.date).toLocaleDateString()}{" "}
                        {new Date(r.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent: "primary" | "emerald" | "amber" | "rose";
}) {
  const accents = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  };
  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${accents[accent]}`}>
            {icon}
          </span>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        </div>
        <div className="font-mono text-2xl font-bold tabular-nums sm:text-3xl">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

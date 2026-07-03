"use client";

import { useAppStore } from "@/lib/store";
import { CURRICULUM, getUnits } from "@/lib/curriculum";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Timer,
  PenLine,
  BarChart3,
  TrendingUp,
  Target,
  Keyboard,
  Zap,
  Trophy,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function HomePage() {
  const setPage = useAppStore((s) => s.setPage);
  const history = useAppStore((s) => s.history);
  const completedLessons = useAppStore((s) => s.completedLessons);

  const totalLessons = CURRICULUM.length;
  const completedCount = Object.keys(completedLessons).length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const recentResults = [...history].slice(-5).reverse();
  const bestWpm = history.length
    ? Math.max(...history.map((h) => h.wpm))
    : 0;
  const avgAccuracy = history.length
    ? Math.round(
        history.reduce((sum, h) => sum + h.accuracy, 0) / history.length
      )
    : 0;
  const totalPracticeMin = history.reduce((sum, h) => sum + h.durationSec, 0) / 60;

  const units = getUnits();

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6 sm:p-10 lg:p-14">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, color-mix(in oklch, var(--primary) 30%, transparent), transparent 50%), radial-gradient(circle at 80% 70%, color-mix(in oklch, var(--accent) 40%, transparent), transparent 50%)",
          }}
        />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Zap className="h-3 w-3" />
            Step-by-step typing coach
          </div>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Type faster, type smarter —<br className="hidden sm:block" /> one key at a time.
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            TypeFlow guides you from your very first keystroke to confident
            touch typing. Structured lessons, real-time feedback, and beautiful
            analytics — all in your browser.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => setPage("lessons")}
              className="h-12 px-6 text-base"
            >
              <GraduationCap className="mr-2 h-5 w-5" />
              Start Learning
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setPage("test")}
              className="h-12 px-6 text-base"
            >
              <Timer className="mr-2 h-5 w-5" />
              Take a Test
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatTile
              icon={<Trophy className="h-4 w-4" />}
              label="Best WPM"
              value={bestWpm}
            />
            <StatTile
              icon={<Target className="h-4 w-4" />}
              label="Avg Accuracy"
              value={`${avgAccuracy}%`}
            />
            <StatTile
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Lessons Done"
              value={`${completedCount}/${totalLessons}`}
            />
            <StatTile
              icon={<TrendingUp className="h-4 w-4" />}
              label="Practice Min"
              value={Math.round(totalPracticeMin)}
            />
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section>
        <h2 className="mb-1 text-2xl font-bold">What you can do here</h2>
        <p className="mb-6 text-muted-foreground">
          Four focused modes — pick what fits your goal today.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<GraduationCap className="h-5 w-5" />}
            title="Guided Lessons"
            description={`${totalLessons} lessons across ${units.length} units, from home row to real paragraphs.`}
            cta="Open lessons"
            onClick={() => setPage("lessons")}
            color="from-emerald-500/20 to-emerald-500/5"
          />
          <FeatureCard
            icon={<PenLine className="h-5 w-5" />}
            title="Free Practice"
            description="Type quotes, pangrams, fun facts, and code snippets. Build stamina with variety."
            cta="Practice now"
            onClick={() => setPage("practice")}
            color="from-amber-500/20 to-amber-500/5"
          />
          <FeatureCard
            icon={<Timer className="h-5 w-5" />}
            title="Timed Tests"
            description="Race the clock with 15s, 30s, 60s, and 120s challenges. Track your top speed."
            cta="Take a test"
            onClick={() => setPage("test")}
            color="from-rose-500/20 to-rose-500/5"
          />
          <FeatureCard
            icon={<BarChart3 className="h-5 w-5" />}
            title="Progress Stats"
            description="See WPM trends, accuracy, and lesson completion over time with charts."
            cta="View stats"
            onClick={() => setPage("stats")}
            color="from-purple-500/20 to-purple-500/5"
          />
        </div>
      </section>

      {/* Continue learning */}
      {completedCount < totalLessons && (
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5 text-primary" />
                Your Learning Path
              </CardTitle>
              <CardDescription>
                {completedCount === 0
                  ? "Start with the home row — it's the foundation of touch typing."
                  : `You've completed ${completedCount} of ${totalLessons} lessons. Keep going!`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Overall progress</span>
                  <span className="font-mono font-medium text-foreground">
                    {progressPercent}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {units.slice(0, 3).map((unit) => (
                  <div key={unit.unit}>
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[0.65rem] font-bold text-primary">
                        {unit.unit}
                      </span>
                      {unit.unitTitle}
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {unit.lessons.map((lesson) => {
                        const done = completedLessons[lesson.id];
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => setPage("lessons")}
                            className="flex items-start gap-2 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/50"
                          >
                            <div className="mt-0.5">
                              {done ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium">
                                {lesson.title}
                              </div>
                              <div className="mt-0.5 text-[0.7rem] text-muted-foreground">
                                {done
                                  ? `Best: ${done.bestWpm} WPM`
                                  : `Target: ${lesson.targetWpm} WPM`}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setPage("lessons")}
                variant="ghost"
                className="mt-4"
              >
                View all lessons
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Recent activity */}
      {recentResults.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-bold">Recent activity</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentResults.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Keyboard className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{r.modeLabel}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(r.date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <div className="font-mono font-semibold text-primary">
                          {r.wpm} WPM
                        </div>
                        <div className="text-[0.7rem] text-muted-foreground">
                          WPM
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-semibold">{r.accuracy}%</div>
                        <div className="text-[0.7rem] text-muted-foreground">
                          Accuracy
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Why touch typing */}
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="mb-2 text-2xl font-bold">Why learn touch typing?</h2>
        <p className="mb-6 text-muted-foreground">
          Touch typing is one of the highest-ROI skills you can build. Here's
          what changes when you stop looking at the keyboard.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Benefit
            icon={<Zap className="h-5 w-5" />}
            title="3× faster writing"
            body="Most touch typists hit 60-90 WPM; hunt-and-peck averages 20-30 WPM. That's a 3× speed-up for everything you write."
          />
          <Benefit
            icon={<Target className="h-5 w-5" />}
            title="Less mental load"
            body="When typing is automatic, your brain is free to focus on what you're saying — not where the keys are."
          />
          <Benefit
            icon={<TrendingUp className="h-5 w-5" />}
            title="Healthier hands"
            body="Proper finger technique distributes the work across all ten fingers, reducing strain and the risk of RSI."
          />
        </div>
      </section>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/80 p-3 backdrop-blur">
      <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[0.7rem] uppercase tracking-wider">{label}</span>
      </div>
      <div className="font-mono text-xl font-bold tabular-nums sm:text-2xl">
        {value}
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  cta,
  onClick,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${color} p-5 text-left transition-all hover:scale-[1.02] hover:shadow-lg`}
    >
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-card/80 text-primary shadow-sm">
        {icon}
      </div>
      <h3 className="mb-1 font-bold">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
        {cta}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

function Benefit({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h4 className="mb-1 font-semibold">{title}</h4>
      <p className="text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

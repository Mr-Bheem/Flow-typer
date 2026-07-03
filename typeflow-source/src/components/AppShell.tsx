"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAppStore, type PageId } from "@/lib/store";
import {
  Home,
  GraduationCap,
  PenLine,
  Timer,
  BarChart3,
  Settings as SettingsIcon,
  Menu,
  X,
  Keyboard,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: Home, description: "Overview & quick start" },
  { id: "lessons", label: "Lessons", icon: GraduationCap, description: "Step-by-step curriculum" },
  { id: "practice", label: "Practice", icon: PenLine, description: "Free typing practice" },
  { id: "test", label: "Timed Test", icon: Timer, description: "Race against the clock" },
  { id: "stats", label: "Stats", icon: BarChart3, description: "Track your progress" },
  { id: "settings", label: "Settings", icon: SettingsIcon, description: "Customize your experience" },
];

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const currentPage = useAppStore((s) => s.currentPage);
  const setPage = useAppStore((s) => s.setPage);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  // next-themes returns undefined theme until mounted on the client
  const mounted = theme !== undefined;

  const navigate = (page: PageId) => {
    setPage(page);
    setMobileOpen(false);
  };

  const activeNav = NAV_ITEMS.find((n) => n.id === currentPage);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md lg:hidden">
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2 font-bold"
          aria-label="TypeFlow home"
        >
          <Logo />
          <span className="text-lg">TypeFlow</span>
        </button>
        <div className="flex items-center gap-2">
          <ThemeToggle mounted={mounted} theme={theme} setTheme={setTheme} />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-[57px] z-30 bg-background/95 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <nav className="flex flex-col gap-1 p-4" onClick={(e) => e.stopPropagation()}>
            {NAV_ITEMS.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                active={currentPage === item.id}
                onClick={() => navigate(item.id)}
                full
              />
            ))}
          </nav>
        </div>
      )}

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-3 border-b border-sidebar-border px-6 py-5 text-left"
          >
            <Logo />
            <div>
              <div className="text-lg font-bold leading-none">TypeFlow</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Master touch typing
              </div>
            </div>
          </button>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
            {NAV_ITEMS.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                active={currentPage === item.id}
                onClick={() => navigate(item.id)}
              />
            ))}
          </nav>

          <div className="border-t border-sidebar-border p-3">
            <div className="flex items-center justify-between rounded-lg bg-sidebar-accent/50 px-3 py-2">
              <span className="text-xs text-muted-foreground">Theme</span>
              <ThemeToggle mounted={mounted} theme={theme} setTheme={setTheme} />
            </div>
            <div className="mt-3 px-3 text-[0.7rem] text-muted-foreground">
              Built with Next.js · Practice daily for best results
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex flex-1 flex-col">
          {/* Page header (breadcrumb-style) */}
          <div className="border-b border-border bg-background/60 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-5xl items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                {activeNav && (
                  <>
                    <activeNav.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{activeNav.label}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="hidden text-muted-foreground sm:inline">
                      {activeNav.description}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">Esc</kbd>
                <span className="hidden sm:inline">to refocus typing</span>
              </div>
            </div>
          </div>

          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl fade-in-up">{children}</div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}

function NavButton({
  item,
  active,
  onClick,
  full,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
  full?: boolean;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
        full && "w-full",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-sidebar-foreground hover:bg-sidebar-accent"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
        )}
      />
      <div className="flex flex-col">
        <span className="font-medium leading-tight">{item.label}</span>
        {!full && (
          <span
            className={cn(
              "text-[0.7rem] leading-tight",
              active ? "text-primary-foreground/80" : "text-muted-foreground"
            )}
          >
            {item.description}
          </span>
        )}
      </div>
    </button>
  );
}

function Logo() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
      <Keyboard className="h-5 w-5" />
    </div>
  );
}

function ThemeToggle({
  mounted,
  theme,
  setTheme,
}: {
  mounted: boolean;
  theme: string | undefined;
  setTheme: (t: string) => void;
}) {
  if (!mounted) {
    return <div className="h-9 w-9 rounded-lg border border-border bg-card" />;
  }
  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-card-foreground transition-colors hover:bg-muted"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background/60 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <Keyboard className="h-3.5 w-3.5" />
          <span>
            <strong className="font-semibold text-foreground">TypeFlow</strong> · Practice daily for
            best results
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>Made with React · Next.js · Tailwind</span>
        </div>
      </div>
    </footer>
  );
}

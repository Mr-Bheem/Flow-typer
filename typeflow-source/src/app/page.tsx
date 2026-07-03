"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { AppShell } from "@/components/AppShell";
import { HomePage } from "@/components/pages/HomePage";
import { LessonsPage } from "@/components/pages/LessonsPage";
import { PracticePage } from "@/components/pages/PracticePage";
import { TestPage } from "@/components/pages/TestPage";
import { StatsPage } from "@/components/pages/StatsPage";
import { SettingsPage } from "@/components/pages/SettingsPage";

export default function Home() {
  const currentPage = useAppStore((s) => s.currentPage);

  // Scroll to top on page change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  return (
    <AppShell>
      {currentPage === "home" && <HomePage />}
      {currentPage === "lessons" && <LessonsPage />}
      {currentPage === "practice" && <PracticePage />}
      {currentPage === "test" && <TestPage />}
      {currentPage === "stats" && <StatsPage />}
      {currentPage === "settings" && <SettingsPage />}
    </AppShell>
  );
}

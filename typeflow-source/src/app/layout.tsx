import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TypeFlow — Master Touch Typing, Step by Step",
  description:
    "TypeFlow is a modern typing practice app with step-by-step lessons, timed tests, and detailed progress analytics. Learn fast typing with guided drills, real-time feedback, and a beautiful, focused interface.",
  keywords: [
    "typing practice",
    "touch typing",
    "typing tutor",
    "WPM",
    "typing speed",
    "typing lessons",
    "learn to type",
    "TypeFlow",
  ],
  authors: [{ name: "TypeFlow" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "TypeFlow — Master Touch Typing, Step by Step",
    description:
      "Guided lessons, timed tests, and detailed analytics to help you type faster and more accurately.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TypeFlow — Master Touch Typing",
    description: "Guided lessons, timed tests, and detailed analytics.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}

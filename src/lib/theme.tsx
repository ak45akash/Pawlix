"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const STORAGE_KEY = "pawlix-theme";

export type ThemeChoice = "light" | "dark" | "system";

type ThemeContextValue = {
  choice: ThemeChoice;
  resolved: "light" | "dark";
  cycle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyTheme(choice: ThemeChoice) {
  const dark = choice === "dark" || (choice === "system" && systemPrefersDark());
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  return dark ? "dark" : "light";
}

let themeVersion = 0;
const listeners = new Set<() => void>();

function emit() {
  themeVersion += 1;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", listener);
  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", listener);
  };
}

function readChoice(): ThemeChoice {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

function getSnapshot() {
  const choice = readChoice();
  const resolved = choice === "dark" || (choice === "system" && systemPrefersDark()) ? "dark" : "light";
  return `${choice}:${resolved}:${themeVersion}`;
}

function getServerSnapshot() {
  return "system:light:0";
}

function cycleTheme() {
  const choice = readChoice();
  const next: ThemeChoice = choice === "system" ? "light" : choice === "light" ? "dark" : "system";
  window.localStorage.setItem(STORAGE_KEY, next);
  applyTheme(next);
  emit();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [choice, resolved] = snapshot.split(":") as [ThemeChoice, "light" | "dark", string];

  return (
    <ThemeContext.Provider value={{ choice, resolved, cycle: cycleTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used within ThemeProvider");
  return value;
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { choice, cycle } = useTheme();
  const label = choice === "system" ? "System theme" : choice === "dark" ? "Dark theme" : "Light theme";
  const Icon = choice === "system" ? Monitor : choice === "dark" ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${label}. Click to change.`}
      title={label}
      className={cn("inline-flex", className || "text-ink-muted hover:text-ink")}
    >
      <Icon className="size-5" />
    </button>
  );
}

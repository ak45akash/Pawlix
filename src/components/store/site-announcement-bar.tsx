"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { useDemo } from "@/lib/demo-store";
import { activeAnnouncements } from "@/lib/marketing";

const DISMISS_KEY = "pawlix-dismissed-announcements";
const EMPTY: string[] = [];
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedIds: string[] = EMPTY;

function getDismissedSnapshot() {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(DISMISS_KEY) ?? "[]";
  if (raw === cachedRaw) return cachedIds;
  cachedRaw = raw;
  try {
    cachedIds = JSON.parse(raw) as string[];
  } catch {
    cachedIds = EMPTY;
  }
  return cachedIds;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function dismissAnnouncementIds(ids: string[]) {
  const next = [...new Set([...getDismissedSnapshot(), ...ids])];
  const raw = JSON.stringify(next);
  window.localStorage.setItem(DISMISS_KEY, raw);
  cachedRaw = raw;
  cachedIds = next;
  listeners.forEach((listener) => listener());
}

function useDismissedAnnouncementIds() {
  return useSyncExternalStore(subscribe, getDismissedSnapshot, () => EMPTY);
}

export function SiteAnnouncementBar() {
  const { state } = useDemo();
  const dismissedIds = useDismissedAnnouncementIds();
  const live = activeAnnouncements(state).filter((item) => !dismissedIds.includes(item.id));
  if (!live.length) return null;

  return (
    <div className="border-b border-border bg-accent-soft text-sm text-ink">
      <div className="store-shell flex w-full items-center gap-3 py-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-1">
          {live.map((item) => (
            <Link key={item.id} href={item.href} className="hover:text-accent">
              {item.message}
            </Link>
          ))}
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            dismissAnnouncementIds(live.map((item) => item.id));
          }}
          className="relative z-10 shrink-0 rounded-md p-1.5 text-ink-muted transition-colors hover:bg-canvas/60 hover:text-ink"
          aria-label="Dismiss announcements"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

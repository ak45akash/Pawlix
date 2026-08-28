"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { filterAdminNav } from "@/lib/admin-nav";
import type { Capability } from "@/lib/permissions/catalogue.ts";
import { cn } from "@/lib/utils/cn";

export function AdminSearch({ can }: { can: (cap: Capability) => boolean }) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => filterAdminNav(query, can), [query, can]);
  const grouped = useMemo(() => {
    const map = new Map<string, { item: (typeof results)[number]; index: number }[]>();
    results.forEach((item, index) => {
      const bucket = map.get(item.group) ?? [];
      bucket.push({ item, index });
      map.set(item.group, bucket);
    });
    return [...map.entries()];
  }, [results]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
      }
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function navigate(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }
    if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      navigate(results[activeIndex].href);
    }
  }

  return (
    <div ref={rootRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onInputKeyDown}
          placeholder="Search admin pages…"
          aria-label="Search admin pages"
          aria-controls="admin-search-results"
          className="w-full rounded-lg border border-border bg-canvas py-2 pr-20 pl-9 text-sm outline-none ring-accent/30 placeholder:text-ink-muted focus:ring-2"
        />
        <div className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveIndex(0);
                inputRef.current?.focus();
              }}
              className="pointer-events-auto rounded p-0.5 text-ink-muted hover:text-ink"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
          <kbd className="hidden rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-ink-muted sm:inline">
            ⌘K
          </kbd>
        </div>
      </div>

      {open ? (
        <div
          id="admin-search-results"
          className="absolute z-50 mt-2 max-h-[min(24rem,70vh)] w-full overflow-y-auto rounded-xl border border-border bg-surface shadow-lg"
        >
          {!results.length ? (
            <p className="px-4 py-6 text-center text-sm text-ink-muted">No admin pages match your search.</p>
          ) : (
            grouped.map(([group, items]) => (
              <div key={group} className="border-b border-border last:border-0">
                <p className="px-4 py-2 text-[11px] font-semibold tracking-wide text-ink-muted uppercase">{group}</p>
                <ul>
                  {items.map(({ item, index }) => {
                    const active = index === activeIndex;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => {
                            setOpen(false);
                            setQuery("");
                          }}
                          className={cn(
                            "flex items-start gap-3 px-4 py-2.5 text-sm transition-colors",
                            active ? "bg-accent-soft text-ink" : "hover:bg-canvas",
                          )}
                          onMouseEnter={() => setActiveIndex(index)}
                        >
                          <item.icon className="mt-0.5 size-4 shrink-0 text-accent" />
                          <span>
                            <span className="block font-medium">{item.label}</span>
                            <span className="block text-xs text-ink-muted">{item.description}</span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

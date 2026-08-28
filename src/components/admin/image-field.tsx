"use client";

import { useId, useState } from "react";
import { formatBytes, optimizeImage } from "@/lib/images";
import { cn } from "@/lib/utils/cn";
import { SmartImage } from "@/components/ui/smart-image";

export function ImageField({
  label,
  value,
  onChange,
  maxEdge = 1600,
}: {
  label: string;
  value: string;
  onChange: (src: string) => void;
  maxEdge?: number;
}) {
  const inputId = useId();
  const [optimize, setOptimize] = useState(true);
  const [busy, setBusy] = useState(false);
  const [stats, setStats] = useState<string>("");
  const [error, setError] = useState("");

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const result = await optimizeImage(file, { enabled: optimize, maxEdge });
      onChange(result.dataUrl);
      if (result.optimized && result.optimizedBytes < result.originalBytes) {
        setStats(`Saved ${formatBytes(result.originalBytes - result.optimizedBytes)} (${formatBytes(result.originalBytes)} → ${formatBytes(result.optimizedBytes)})`);
      } else {
        setStats(optimize ? `Kept at ${formatBytes(result.optimizedBytes)}` : `Original ${formatBytes(result.originalBytes)} — optimize is off`);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not read that image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{label}</span>
        <label className="flex items-center gap-2 text-xs text-ink-muted">
          <input type="checkbox" checked={optimize} onChange={(event) => setOptimize(event.target.checked)} />
          Optimize image
        </label>
      </div>
      {value ? (
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border bg-canvas">
          <SmartImage src={value} alt="" fill className="object-cover" sizes="640px" />
        </div>
      ) : (
        <div className="grid aspect-[16/9] place-items-center rounded-lg border border-dashed border-border text-sm text-ink-muted">
          No image yet
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor={inputId}
          className={cn(
            "inline-flex h-9 cursor-pointer items-center rounded-md border border-border bg-surface px-3 text-sm",
            busy && "pointer-events-none opacity-50",
          )}
        >
          {busy ? "Compressing…" : "Upload"}
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            void onFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        {value ? (
          <button type="button" className="text-sm text-danger" onClick={() => onChange("")}>
            Remove
          </button>
        ) : null}
      </div>
      {stats ? <p className="text-xs text-success">{stats}</p> : null}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
      <p className="text-xs text-ink-muted">
        Optimization resizes to {maxEdge}px and compresses WebP/JPEG so posts stay small in this browser.
      </p>
    </div>
  );
}

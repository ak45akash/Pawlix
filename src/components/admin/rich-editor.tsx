"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import { formatBytes, optimizeImage } from "@/lib/images";
import { cn } from "@/lib/utils/cn";

const TOOLS = [
  { icon: Bold, label: "Bold", command: "bold" },
  { icon: Italic, label: "Italic", command: "italic" },
  { icon: Heading2, label: "Heading", command: "formatBlock", value: "H2" },
  { icon: Heading3, label: "Subheading", command: "formatBlock", value: "H3" },
  { icon: Quote, label: "Quote", command: "formatBlock", value: "BLOCKQUOTE" },
  { icon: List, label: "Bullets", command: "insertUnorderedList" },
  { icon: ListOrdered, label: "Numbers", command: "insertOrderedList" },
] as const;

export function RichEditor({
  value,
  onChange,
  placeholder = "Write here…",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const areaRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const lastValue = useRef(value);
  const [optimize, setOptimize] = useState(true);
  const [stats, setStats] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const node = areaRef.current;
    if (!node) return;
    if (!node.innerHTML && value) {
      node.innerHTML = value;
      lastValue.current = value;
      return;
    }
    if (value !== lastValue.current) {
      node.innerHTML = value;
      lastValue.current = value;
    }
  }, [value]);

  function emit() {
    const html = areaRef.current?.innerHTML ?? "";
    lastValue.current = html;
    onChange(html);
  }

  function run(command: string, commandValue?: string) {
    areaRef.current?.focus();
    document.execCommand(command, false, commandValue);
    emit();
  }

  function insertLink() {
    const href = window.prompt("Link URL");
    if (href) run("createLink", href);
  }

  async function insertImage(file: File) {
    setBusy(true);
    setStats("");
    try {
      const result = await optimizeImage(file, { enabled: optimize, maxEdge: 1200, quality: 0.7 });
      areaRef.current?.focus();
      document.execCommand("insertHTML", false, `<img src="${result.dataUrl}" alt="" />`);
      emit();
      if (result.optimized && result.optimizedBytes < result.originalBytes) {
        setStats(`Image ${formatBytes(result.originalBytes)} → ${formatBytes(result.optimizedBytes)}`);
      } else {
        setStats(`Image ${formatBytes(result.optimizedBytes)}`);
      }
    } catch {
      setStats("Could not insert that image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex flex-wrap items-center gap-1 border-b border-border px-2 py-1.5">
        {TOOLS.map((tool) => (
          <button
            key={tool.label}
            type="button"
            title={tool.label}
            className="rounded-md p-2 text-ink-muted hover:bg-canvas hover:text-ink"
            onClick={() => run(tool.command, "value" in tool ? tool.value : undefined)}
          >
            <tool.icon className="size-4" />
          </button>
        ))}
        <button
          type="button"
          title="Link"
          className="rounded-md p-2 text-ink-muted hover:bg-canvas hover:text-ink"
          onClick={insertLink}
        >
          <LinkIcon className="size-4" />
        </button>
        <button
          type="button"
          title="Insert image"
          className="rounded-md p-2 text-ink-muted hover:bg-canvas hover:text-ink"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
        >
          <ImagePlus className="size-4" />
        </button>
        <label className="ml-auto flex items-center gap-2 px-2 text-xs text-ink-muted">
          <input type="checkbox" checked={optimize} onChange={(event) => setOptimize(event.target.checked)} />
          Optimize images
        </label>
      </div>
      <div
        ref={areaRef}
        className={cn("rich-content min-h-[min(72vh,820px)] px-6 py-5 outline-none md:px-10 md:py-8", !value && "is-empty")}
        contentEditable
        role="textbox"
        aria-label={placeholder}
        data-placeholder={placeholder}
        suppressContentEditableWarning
        onInput={emit}
        onPaste={(event) => {
          const item = Array.from(event.clipboardData?.items ?? []).find((entry) => entry.type.startsWith("image/"));
          if (!item) return;
          const file = item.getAsFile();
          if (!file) return;
          event.preventDefault();
          void insertImage(file);
        }}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void insertImage(file);
          event.target.value = "";
        }}
      />
      {stats ? <p className="border-t border-border px-4 py-2 text-xs text-ink-muted">{busy ? "Compressing…" : stats}</p> : null}
    </div>
  );
}

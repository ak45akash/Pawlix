import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function FilterChip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm transition-colors",
        active ? "bg-ink text-canvas" : "bg-surface text-ink-muted ring-1 ring-border hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

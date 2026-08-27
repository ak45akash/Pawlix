import { cn } from "@/lib/utils/cn";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "danger" | "accent";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium",
        tone === "neutral" && "bg-canvas text-ink-muted",
        tone === "success" && "bg-[#e7f0ea] text-success",
        tone === "danger" && "bg-[#f8e8e8] text-danger",
        tone === "accent" && "bg-[#f6e7dc] text-accent",
      )}
    >
      {children}
    </span>
  );
}

import { cn } from "@/lib/utils/cn";

export function scoreTone(score: number) {
  if (score >= 80) return "success" as const;
  if (score >= 50) return "accent" as const;
  return "danger" as const;
}

export function SeoMeter({ score, size = "md" }: { score: number; size?: "sm" | "md" }) {
  const tone = scoreTone(score);
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold tabular-nums",
        size === "sm" ? "size-8 text-xs" : "size-14 text-lg",
        tone === "success" && "bg-success-soft text-success",
        tone === "accent" && "bg-accent-soft text-accent",
        tone === "danger" && "bg-danger-soft text-danger",
      )}
    >
      {score}
    </span>
  );
}

export function SeoChecks({
  checks,
}: {
  checks: { id: string; label: string; status: "pass" | "warn" | "fail"; detail: string }[];
}) {
  return (
    <ul className="space-y-2 text-sm">
      {checks.map((check) => (
        <li key={check.id} className="flex gap-2">
          <span
            className={cn(
              "mt-0.5 size-2 shrink-0 rounded-full",
              check.status === "pass" && "bg-success",
              check.status === "warn" && "bg-accent",
              check.status === "fail" && "bg-danger",
            )}
          />
          <div>
            <p className="font-medium">{check.label}</p>
            <p className="text-xs text-ink-muted">{check.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SerpPreview({ title, url, description }: { title: string; url: string; description: string }) {
  return (
    <div className="rounded-md border border-border bg-surface p-3">
      <p className="text-[13px] text-[#1a0dab]">{title || "Title"}</p>
      <p className="text-[12px] text-[#006621]">{url}</p>
      <p className="mt-1 text-[12px] leading-snug text-ink-muted">{description || "Meta description"}</p>
    </div>
  );
}

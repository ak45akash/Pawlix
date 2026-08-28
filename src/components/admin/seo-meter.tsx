import { cn } from "@/lib/utils/cn";

export function SeoSuggestions({ items }: { items: { id: string; priority: "high" | "medium" | "low"; title: string; detail: string }[] }) {
  if (!items.length) {
    return <p className="text-sm text-ink-muted">No open issues — keep publishing, linking internally, and refreshing meta descriptions seasonally.</p>;
  }
  return (
    <ol className="space-y-3 text-sm">
      {items.map((item, index) => (
        <li key={item.id} className="flex gap-3">
          <span
            className={cn(
              "mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              item.priority === "high" && "bg-danger-soft text-danger",
              item.priority === "medium" && "bg-accent-soft text-accent",
              item.priority === "low" && "bg-canvas text-ink-muted ring-1 ring-border",
            )}
          >
            {item.priority}
          </span>
          <div>
            <p className="font-medium">
              {index + 1}. {item.title}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{item.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function KeywordGroups({
  groups,
  onSelect,
}: {
  groups: { id: string; label: string; hint: string; terms: string[] }[];
  onSelect?: (term: string) => void;
}) {
  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div key={group.id}>
          <h3 className="text-sm font-medium">{group.label}</h3>
          <p className="mt-1 text-xs text-ink-muted">{group.hint}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {group.terms.map((term) =>
              onSelect ? (
                <button
                  key={term}
                  type="button"
                  onClick={() => onSelect(term)}
                  className="rounded-full bg-canvas px-3 py-1 text-xs text-ink-muted ring-1 ring-border hover:text-ink"
                >
                  {term}
                </button>
              ) : (
                <span key={term} className="rounded-full bg-canvas px-3 py-1 text-xs text-ink-muted ring-1 ring-border">
                  {term}
                </span>
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

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

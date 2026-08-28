"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { scoreTone } from "@/components/admin/seo-meter";
import { MarketingPageHeader, RequireMarketing } from "@/components/admin/marketing-shell";
import { contentCalendarRows } from "@/lib/marketing";
import { useDemo } from "@/lib/demo-store";

export default function ContentCalendarPage() {
  return (
    <RequireMarketing>
      <ContentCalendar />
    </RequireMarketing>
  );
}

function ContentCalendar() {
  const { state } = useDemo();
  const rows = contentCalendarRows(state);
  const drafts = rows.filter((row) => !row.published);
  const published = rows.filter((row) => row.published);

  return (
    <div className="space-y-8">
      <MarketingPageHeader
        title="Content calendar"
        description="Plan blog and recipe publishing by SEO score and focus keyword. Fix drafts before they go live."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-semibold tabular-nums">{published.length}</p>
          <p className="mt-1 text-sm text-ink-muted">Published</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-semibold tabular-nums">{drafts.length}</p>
          <p className="mt-1 text-sm text-ink-muted">Drafts</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-semibold tabular-nums">
            {rows.length ? Math.round(rows.reduce((sum, row) => sum + row.score, 0) / rows.length) : 0}
          </p>
          <p className="mt-1 text-sm text-ink-muted">Avg SEO score</p>
        </div>
      </div>

      {drafts.length ? (
        <section>
          <h2 className="font-medium">Drafts to finish</h2>
          <CalendarTable rows={drafts} />
        </section>
      ) : null}

      <section>
        <h2 className="font-medium">Published content</h2>
        <CalendarTable rows={published} />
      </section>
    </div>
  );
}

function CalendarTable({
  rows,
}: {
  rows: ReturnType<typeof contentCalendarRows>;
}) {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border text-ink-muted">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Keyword</th>
            <th className="px-4 py-3">Score</th>
            <th className="px-4 py-3">Updated</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">{row.title}</td>
              <td className="px-4 py-3 capitalize">{row.kind}</td>
              <td className="px-4 py-3 text-xs text-ink-muted">{row.focusKeyword || "—"}</td>
              <td className="px-4 py-3">
                <Badge tone={scoreTone(row.score)}>{row.score}</Badge>
              </td>
              <td className="px-4 py-3 text-xs text-ink-muted">{new Date(row.updatedAt).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-right">
                <Link href={row.href} className="text-accent">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { scoreTone } from "@/components/admin/seo-meter";
import { MarketingPageHeader, RequireMarketing } from "@/components/admin/marketing-shell";
import { TableSortSelect } from "@/components/admin/table-sort-select";
import { cmpDate, cmpNumber, cmpString, sortRows } from "@/lib/admin-table-sort";
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
  const [sort, setSort] = useState("updated-desc");
  const sortOptions = [
    { value: "updated-desc", label: "Recently updated" },
    { value: "updated-asc", label: "Oldest update" },
    { value: "score-asc", label: "SEO score (low first)" },
    { value: "score-desc", label: "SEO score (high first)" },
    { value: "title-asc", label: "Title (A–Z)" },
    { value: "kind-asc", label: "Type (A–Z)" },
  ];
  const sortedRows = useMemo(
    () =>
      sortRows(rows, sort, {
        "updated-desc": (a, b) => cmpDate(b.updatedAt, a.updatedAt),
        "updated-asc": (a, b) => cmpDate(a.updatedAt, b.updatedAt),
        "score-asc": (a, b) => cmpNumber(a.score, b.score),
        "score-desc": (a, b) => cmpNumber(b.score, a.score),
        "title-asc": (a, b) => cmpString(a.title, b.title),
        "kind-asc": (a, b) => cmpString(a.kind, b.kind),
      }),
    [rows, sort],
  );

  return (
    <div className="mt-4 space-y-3">
      <div className="flex justify-end">
        <TableSortSelect options={sortOptions} value={sort} onChange={setSort} />
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
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
          {sortedRows.map((row) => (
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
    </div>
  );
}

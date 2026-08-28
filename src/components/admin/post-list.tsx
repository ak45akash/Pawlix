"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSortSelect } from "@/components/admin/table-sort-select";
import { cmpDate, cmpNumber, cmpString, sortRows } from "@/lib/admin-table-sort";
import { formatDate } from "@/lib/format";
import { analyzePost } from "@/lib/seo";
import { scoreTone } from "@/components/admin/seo-meter";
import { useDemo } from "@/lib/demo-store";
import type { ContentKind } from "@/types/catalog";

export function PostList({ kind }: { kind: ContentKind }) {
  const { state, deleteEntity, can } = useDemo();
  const canDelete = can("content.delete");
  const [sort, setSort] = useState("date-desc");
  const sortOptions = [
    { value: "date-desc", label: "Newest first" },
    { value: "date-asc", label: "Oldest first" },
    { value: "title-asc", label: "Title (A–Z)" },
    { value: "score-desc", label: "SEO score (high)" },
    { value: "score-asc", label: "SEO score (low)" },
    { value: "status-draft", label: "Drafts first" },
  ];
  const rows = useMemo(() => {
    const filtered = state.posts.filter((post) => post.kind === kind && !post.archived);
    return sortRows(filtered, sort, {
      "date-desc": (a, b) => cmpDate(b.publishedAt, a.publishedAt),
      "date-asc": (a, b) => cmpDate(a.publishedAt, b.publishedAt),
      "title-asc": (a, b) => cmpString(a.title, b.title),
      "score-desc": (a, b) => cmpNumber(analyzePost(b).score, analyzePost(a).score),
      "score-asc": (a, b) => cmpNumber(analyzePost(a).score, analyzePost(b).score),
      "status-draft": (a, b) => cmpNumber(Number(a.published), Number(b.published)),
    });
  }, [state.posts, kind, sort]);
  const title = kind === "recipe" ? "Recipes" : "Blog";
  const base = kind === "recipe" ? "/admin/recipes" : "/admin/blog";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Write in the editor, insert images, and publish to the storefront. Save as draft until you are ready.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <TableSortSelect options={sortOptions} value={sort} onChange={setSort} />
          <Link href={`${base}/new`}>
            <Button size="sm">Add {kind}</Button>
          </Link>
        </div>
      </div>
      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">SEO</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const seoScore = analyzePost(row).score;
              return (
              <tr key={row.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <Link href={`${base}/${row.id}`} className="font-medium">
                    {row.title}
                  </Link>
                  <p className="text-xs text-ink-muted">{row.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={row.published ? "success" : "neutral"}>{row.published ? "Published" : "Draft"}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={scoreTone(seoScore)}>{seoScore}</Badge>
                </td>
                <td className="px-4 py-3">{formatDate(row.publishedAt)}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link href={`${base}/${row.id}`} className="text-accent">
                    Edit
                  </Link>
                  {canDelete ? (
                    <button
                      className="ml-3 text-danger"
                      onClick={() => {
                        if (confirm(`Delete ${row.title}?`)) deleteEntity("posts", row.id);
                      }}
                    >
                      Delete
                    </button>
                  ) : null}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

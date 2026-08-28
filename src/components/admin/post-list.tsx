"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { analyzePost } from "@/lib/seo";
import { scoreTone } from "@/components/admin/seo-meter";
import { useDemo } from "@/lib/demo-store";
import type { ContentKind } from "@/types/catalog";

export function PostList({ kind }: { kind: ContentKind }) {
  const { state, deleteEntity, can } = useDemo();
  const canDelete = can("content.delete");
  const rows = state.posts
    .filter((post) => post.kind === kind && !post.archived)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const title = kind === "recipe" ? "Recipes" : "Blog";
  const base = kind === "recipe" ? "/admin/recipes" : "/admin/blog";

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Write in the editor, insert images, and publish to the storefront. Save as draft until you are ready.
          </p>
        </div>
        <Link href={`${base}/new`}>
          <Button size="sm">Add {kind}</Button>
        </Link>
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

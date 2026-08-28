"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { ImageField } from "@/components/admin/image-field";
import { RichEditor } from "@/components/admin/rich-editor";
import { SeoChecks, SeoMeter, SerpPreview } from "@/components/admin/seo-meter";
import { emptyPost, postPath } from "@/lib/content";
import { estimateReadingMinutes, sanitizeHtml } from "@/lib/html";
import { analyzePost } from "@/lib/seo";
import { createId, slugify } from "@/lib/slug";
import { useDemo } from "@/lib/demo-store";
import type { ContentKind, ContentPost } from "@/types/catalog";

export function PostForm({ kind, postId }: { kind: ContentKind; postId?: string }) {
  const { state, savePost, can } = useDemo();
  const router = useRouter();
  const existing = postId ? state.posts.find((post) => post.id === postId && post.kind === kind) : undefined;
  const [draft, setDraft] = useState<ContentPost>(() =>
    existing ?? { ...emptyPost(kind), id: createId(kind === "recipe" ? "rec" : "post"), petTypeIds: state.petTypes.map((pet) => pet.id) },
  );
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const listHref = kind === "recipe" ? "/admin/recipes" : "/admin/blog";
  const canPublish = can("content.publish");
  const report = useMemo(() => analyzePost(draft), [draft]);
  const seoTitle = draft.seoTitle || `${draft.title} | Pawlix`;
  const seoDescription = draft.seoDescription || draft.excerpt;

  function togglePet(id: string) {
    setDraft((current) => ({
      ...current,
      petTypeIds: current.petTypeIds.includes(id)
        ? current.petTypeIds.filter((petId) => petId !== id)
        : [...current.petTypeIds, id],
    }));
  }

  function persist(published: boolean) {
    setError("");
    setNotice("");
    if (!draft.title.trim()) {
      setError("Add a title.");
      return;
    }
    const body = sanitizeHtml(draft.body);
    const next: ContentPost = {
      ...draft,
      published,
      featured: published ? draft.featured : false,
      slug: draft.slug || slugify(draft.title),
      body,
      excerpt: draft.excerpt || body.replace(/<[^>]+>/g, " ").trim().slice(0, 160),
      seoTitle: draft.seoTitle || `${draft.title} | Pawlix`,
      seoDescription: draft.seoDescription || draft.excerpt || body.replace(/<[^>]+>/g, " ").trim().slice(0, 160),
      readingMinutes: estimateReadingMinutes(body),
      updatedAt: new Date().toISOString(),
      publishedAt: published
        ? draft.published
          ? draft.publishedAt
          : new Date().toISOString()
        : draft.publishedAt,
    };
    try {
      savePost(next);
      setDraft(next);
      setNotice(published ? "Published." : "Draft saved.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save.");
    }
  }

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 lg:px-6">
        <div>
          <button type="button" className="text-xs text-ink-muted hover:text-ink" onClick={() => router.push(listHref)}>
            ← All {kind === "recipe" ? "recipes" : "posts"}
          </button>
          <p className="text-sm font-medium">{existing ? "Edit" : "New"} {kind}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {draft.published ? (
            <a href={postPath(draft)} className="mr-2 text-sm text-accent" target="_blank" rel="noreferrer">
              View
            </a>
          ) : (
            <span className="mr-2 text-xs text-ink-muted">Draft — not on the storefront</span>
          )}
          <Button variant="secondary" size="sm" onClick={() => persist(false)}>
            Save draft
          </Button>
          {canPublish ? (
            <Button size="sm" onClick={() => persist(true)}>
              {draft.published ? "Update" : "Publish"}
            </Button>
          ) : (
            <span className="text-xs text-ink-muted">Your role cannot publish</span>
          )}
        </div>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 px-4 py-6 lg:px-10 lg:py-8">
          <input
            value={draft.title}
            onChange={(event) =>
              setDraft({
                ...draft,
                title: event.target.value,
                slug: existing ? draft.slug : slugify(event.target.value),
              })
            }
            placeholder="Add title"
            className="font-display w-full border-0 bg-transparent text-3xl outline-none placeholder:text-ink-muted md:text-4xl"
          />
          <p className="mt-2 mb-6 text-xs text-ink-muted">/{kind === "recipe" ? "recipes" : "blog"}/{draft.slug || "slug"}</p>
          <RichEditor value={draft.body} onChange={(body) => setDraft({ ...draft, body })} placeholder="Write the post…" />
          {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
          {notice ? <p className="mt-4 text-sm text-success">{notice}</p> : null}
        </div>

        <aside className="space-y-5 border-t border-border bg-surface px-4 py-6 lg:border-t-0 lg:border-l lg:px-5">
          <div>
            <p className="text-sm font-medium">Status</p>
            <p className="mt-1 text-sm text-ink-muted">{draft.published ? "Published" : "Draft"}</p>
          </div>
          <Field label="Slug">
            <Input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: slugify(event.target.value) })} />
          </Field>
          <Field label="Excerpt">
            <Textarea value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} />
          </Field>
          <ImageField label="Cover image" value={draft.coverImage} onChange={(coverImage) => setDraft({ ...draft, coverImage })} />
          <Field label="Shown for pet types">
            <div className="flex flex-col gap-2">
              {state.petTypes
                .filter((pet) => !pet.archived)
                .map((pet) => (
                  <label key={pet.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={draft.petTypeIds.includes(pet.id)} onChange={() => togglePet(pet.id)} />
                    {pet.name}
                  </label>
                ))}
            </div>
          </Field>
          {kind === "recipe" ? (
            <>
              <Field label="Servings">
                <Input value={draft.servings} onChange={(event) => setDraft({ ...draft, servings: event.target.value })} />
              </Field>
              <Field label="Prep minutes">
                <Input
                  type="number"
                  value={draft.prepMinutes ?? ""}
                  onChange={(event) => setDraft({ ...draft, prepMinutes: event.target.value ? Number(event.target.value) : null })}
                />
              </Field>
              <Field label="Cook minutes">
                <Input
                  type="number"
                  value={draft.cookMinutes ?? ""}
                  onChange={(event) => setDraft({ ...draft, cookMinutes: event.target.value ? Number(event.target.value) : null })}
                />
              </Field>
            </>
          ) : null}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.featured}
              disabled={!draft.published}
              onChange={(event) => setDraft({ ...draft, featured: event.target.checked })}
            />
            Featured on homepage
          </label>
          <div className="border-t border-border pt-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">SEO</p>
              <SeoMeter score={report.score} size="sm" />
            </div>
            <Field label="Focus keyword">
              <Input
                value={draft.focusKeyword}
                onChange={(event) => setDraft({ ...draft, focusKeyword: event.target.value })}
                list="post-focus-keywords"
              />
            </Field>
            <datalist id="post-focus-keywords">
              {state.seo.focusKeywords.map((keyword) => (
                <option key={keyword} value={keyword} />
              ))}
            </datalist>
            <Field label="SEO title" hint={`${seoTitle.length}/60`}>
              <Input value={draft.seoTitle} placeholder={`${draft.title} | Pawlix`} onChange={(event) => setDraft({ ...draft, seoTitle: event.target.value })} />
            </Field>
            <Field label="Meta description" hint={`${seoDescription.length}/160`}>
              <Textarea value={draft.seoDescription} placeholder={draft.excerpt} onChange={(event) => setDraft({ ...draft, seoDescription: event.target.value })} />
            </Field>
            <div className="mt-3">
              <SerpPreview
                title={seoTitle}
                url={`pawlix.com/${kind === "recipe" ? "recipes" : "blog"}/${draft.slug || "slug"}`}
                description={seoDescription}
              />
            </div>
            <div className="mt-4 max-h-64 overflow-y-auto">
              <SeoChecks checks={report.checks.filter((check) => check.status !== "pass").slice(0, 6)} />
            </div>
            <a href="/admin/seo" className="mt-3 inline-block text-xs text-accent">
              Open SEO tools
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

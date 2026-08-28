"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Textarea } from "@/components/ui/field";
import { RequireCapability } from "@/components/admin/guard";
import { SeoChecks, SeoMeter, SerpPreview, scoreTone } from "@/components/admin/seo-meter";
import { analyzeContent, analyzeSite, extractKeywords, serpPreview, slugFromKeyword } from "@/lib/seo";
import { useDemo } from "@/lib/demo-store";

export default function SeoPage() {
  return (
    <RequireCapability capability="seo.view">
      <SeoTools />
    </RequireCapability>
  );
}

function SeoTools() {
  const { state, saveSeo, can } = useDemo();
  const canEdit = can("seo.edit");
  const site = useMemo(() => analyzeSite(state), [state]);
  const [title, setTitle] = useState(state.seo.title);
  const [description, setDescription] = useState(state.seo.description);
  const [keywords, setKeywords] = useState(state.seo.keywords.join(", "));
  const [ogImage, setOgImage] = useState(state.seo.ogImage);
  const [locale, setLocale] = useState(state.seo.locale);
  const [twitterHandle, setTwitterHandle] = useState(state.seo.twitterHandle);
  const [focusKeywords, setFocusKeywords] = useState(state.seo.focusKeywords.join(", "));
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const [toolTitle, setToolTitle] = useState("");
  const [toolMeta, setToolMeta] = useState("");
  const [toolSlug, setToolSlug] = useState("");
  const [toolKeyword, setToolKeyword] = useState(state.seo.focusKeywords[0] ?? "");
  const [toolBody, setToolBody] = useState("");
  const [filter, setFilter] = useState<"all" | "blog" | "recipe" | "product">("all");

  const snippet = serpPreview(title, description, "/", "pawlix.com");
  const draftReport = analyzeContent({
    kind: "page",
    title: toolTitle,
    slug: toolSlug || slugFromKeyword(toolKeyword || toolTitle),
    body: toolBody,
    seoTitle: toolTitle,
    seoDescription: toolMeta,
    focusKeyword: toolKeyword,
  });
  const extracted = extractKeywords(`${toolTitle} ${toolMeta} ${toolBody}`, 10);
  const audit = site.pages.filter((page) => filter === "all" || page.kind === filter);

  function persist() {
    setError("");
    setNotice("");
    try {
      saveSeo({
        title: title.trim(),
        description: description.trim(),
        keywords: splitList(keywords),
        ogImage: ogImage.trim(),
        locale: locale.trim() || "en-IN",
        twitterHandle: twitterHandle.trim(),
        focusKeywords: splitList(focusKeywords),
      });
      setNotice("Site SEO saved.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save.");
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">SEO</h1>
          <p className="mt-1 max-w-xl text-sm text-ink-muted">
            Score the whole site, blogs, recipes and products. Use the tools below to check titles, keywords and snippets.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3">
          <SeoMeter score={site.score} />
          <div>
            <p className="text-sm font-medium">Site score</p>
            <p className="text-xs text-ink-muted">Based on metadata, content, and index coverage.</p>
          </div>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-medium">Site-wide SEO</h2>
          <div className="mt-4 space-y-3">
            <Field label="SEO title" hint={`${title.length}/60`}>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} disabled={!canEdit} />
            </Field>
            <Field label="Meta description" hint={`${description.length}/160`}>
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} disabled={!canEdit} />
            </Field>
            <Field label="Keywords" hint="Comma-separated">
              <Input value={keywords} onChange={(event) => setKeywords(event.target.value)} disabled={!canEdit} />
            </Field>
            <Field label="Focus keyword library" hint="Phrases you want the shop to rank for">
              <Input value={focusKeywords} onChange={(event) => setFocusKeywords(event.target.value)} disabled={!canEdit} />
            </Field>
            <Field label="Default share image URL">
              <Input value={ogImage} onChange={(event) => setOgImage(event.target.value)} disabled={!canEdit} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Locale">
                <Input value={locale} onChange={(event) => setLocale(event.target.value)} disabled={!canEdit} />
              </Field>
              <Field label="Twitter / X handle">
                <Input value={twitterHandle} onChange={(event) => setTwitterHandle(event.target.value)} disabled={!canEdit} />
              </Field>
            </div>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            {notice ? <p className="text-sm text-success">{notice}</p> : null}
            {canEdit ? <Button onClick={persist}>Save site SEO</Button> : <p className="text-sm text-ink-muted">View only for your role.</p>}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-medium">Search preview</h2>
            <div className="mt-3">
              <SerpPreview title={snippet.title} url={snippet.url} description={snippet.description} />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-medium">Site checks</h2>
            <div className="mt-3">
              <SeoChecks checks={site.checks} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-medium">Content audit</h2>
          <div className="flex flex-wrap gap-2 text-sm">
            {(["all", "blog", "recipe", "product"] as const).map((kind) => (
              <button
                key={kind}
                type="button"
                onClick={() => setFilter(kind)}
                className={`rounded-full px-3 py-1 ${filter === kind ? "bg-ink text-canvas" : "bg-canvas text-ink-muted"}`}
              >
                {kind === "all" ? "All" : kind === "blog" ? "Blogs" : kind === "recipe" ? "Recipes" : "Products"}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-ink-muted">
              <tr>
                <th className="py-2 pr-4 font-medium">Page</th>
                <th className="py-2 pr-4 font-medium">Type</th>
                <th className="py-2 pr-4 font-medium">Score</th>
                <th className="py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {audit.map((page) => (
                <tr key={`${page.kind}-${page.id}`} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4">{page.label}</td>
                  <td className="py-2 pr-4 capitalize">{page.kind}</td>
                  <td className="py-2 pr-4">
                    <Badge tone={scoreTone(page.score)}>{page.score}</Badge>
                  </td>
                  <td className="py-2 text-right">
                    <Link href={page.href} className="text-accent">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-medium">Snippet and keyword lab</h2>
          <p className="mt-1 text-sm text-ink-muted">Paste a draft title, meta, and body. Scores stay on this page until you save the real post.</p>
          <div className="mt-4 space-y-3">
            <Field label="Focus keyword">
              <Input value={toolKeyword} onChange={(event) => setToolKeyword(event.target.value)} list="pawlix-focus-keywords" />
            </Field>
            <datalist id="pawlix-focus-keywords">
              {state.seo.focusKeywords.map((keyword) => (
                <option key={keyword} value={keyword} />
              ))}
            </datalist>
            <Field label="Title" hint={`${toolTitle.length}/60`}>
              <Input value={toolTitle} onChange={(event) => setToolTitle(event.target.value)} />
            </Field>
            <Field label="Meta description" hint={`${toolMeta.length}/160`}>
              <Textarea value={toolMeta} onChange={(event) => setToolMeta(event.target.value)} />
            </Field>
            <Field label="Slug" hint="Leave blank to build from the keyword">
              <Input value={toolSlug} onChange={(event) => setToolSlug(event.target.value)} placeholder={slugFromKeyword(toolKeyword || toolTitle)} />
            </Field>
            <Field label="Body">
              <Textarea className="min-h-36" value={toolBody} onChange={(event) => setToolBody(event.target.value)} />
            </Field>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3">
            <SeoMeter score={draftReport.score} />
            <div>
              <p className="text-sm font-medium">Draft score</p>
              <p className="text-xs text-ink-muted">{draftReport.wordCount} words</p>
            </div>
          </div>
          <SerpPreview
            title={draftReport.title || "Draft title"}
            url={`pawlix.com/${toolSlug || slugFromKeyword(toolKeyword || toolTitle) || "slug"}`}
            description={draftReport.description}
          />
          <div className="rounded-lg border border-border bg-surface p-5">
            <h3 className="text-sm font-medium">Suggested keywords</h3>
            {extracted.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {extracted.map((item) => (
                  <button
                    key={item.term}
                    type="button"
                    className="rounded-full bg-canvas px-3 py-1 text-xs text-ink-muted ring-1 ring-border hover:text-ink"
                    onClick={() => setToolKeyword(item.term)}
                  >
                    {item.term} · {item.count}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-ink-muted">Add body copy to extract keywords.</p>
            )}
          </div>
          <div className="rounded-lg border border-border bg-surface p-5">
            <h3 className="text-sm font-medium">Checks</h3>
            <div className="mt-3 max-h-80 overflow-y-auto">
              <SeoChecks checks={draftReport.checks} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { HtmlContent } from "@/components/store/html-content";
import { SmartImage } from "@/components/ui/smart-image";
import { findPost, shopHref } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { articleJsonLd } from "@/lib/seo";
import { getSiteUrl } from "@/config/env";
import { PageSeo } from "@/components/store/page-seo";
import { useDemo } from "@/lib/demo-store";

export default function RecipePostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { state } = useDemo();
  const post = findPost(state, slug, "recipe");

  if (!post || !post.published) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="font-display text-3xl">Recipe not found</h1>
        <Link href="/recipes" className="mt-4 inline-block text-sm text-accent">
          Back to recipes
        </Link>
      </main>
    );
  }

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
      <PageSeo
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt}
        path={`/recipes/${post.slug}`}
        image={post.coverImage}
        type="article"
        keywords={post.focusKeyword ? [post.focusKeyword] : []}
        jsonLd={articleJsonLd(post, getSiteUrl())}
      />
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="text-xs tracking-[0.2em] text-accent uppercase">Recipe · {formatDate(post.publishedAt)}</p>
          <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            {post.servings ? (
              <span className="rounded-full bg-surface px-3 py-1.5 ring-1 ring-border">Serves {post.servings}</span>
            ) : null}
            {post.prepMinutes != null ? (
              <span className="rounded-full bg-surface px-3 py-1.5 ring-1 ring-border">Prep {post.prepMinutes} min</span>
            ) : null}
            {post.cookMinutes != null ? (
              <span className="rounded-full bg-surface px-3 py-1.5 ring-1 ring-border">Cook {post.cookMinutes} min</span>
            ) : null}
          </div>
          <HtmlContent html={post.body} className="mt-10" />
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-canvas">
          <SmartImage src={post.coverImage} alt={post.title} fill className="object-cover" sizes="50vw" />
        </div>
      </div>
      {post.petTypeIds.length ? (
        <div className="mt-12 flex flex-wrap gap-2">
          {post.petTypeIds.map((id) => {
            const pet = state.petTypes.find((item) => item.id === id);
            if (!pet) return null;
            return (
              <Link key={id} href={shopHref({ pet: pet.slug })} className="rounded-full bg-surface px-3 py-1.5 text-sm text-ink-muted ring-1 ring-border">
                Shop {pet.name}
              </Link>
            );
          })}
        </div>
      ) : null}
    </article>
  );
}

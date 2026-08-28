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

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { state } = useDemo();
  const post = findPost(state, slug, "blog");

  if (!post || !post.published) {
    return (
      <main className="store-shell py-16">
        <h1 className="font-display text-3xl">Post not found</h1>
        <Link href="/blog" className="mt-4 inline-block text-sm text-accent">
          Back to journal
        </Link>
      </main>
    );
  }

  return (
    <article className="pb-20">
      <PageSeo
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.coverImage}
        type="article"
        keywords={post.focusKeyword ? [post.focusKeyword] : []}
        jsonLd={articleJsonLd(post, getSiteUrl())}
      />
      <div className="relative h-[42vh] min-h-72 overflow-hidden bg-inverse">
        <SmartImage src={post.coverImage} alt={post.title} fill className="object-cover opacity-80" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-inverse/80 to-inverse/10" />
        <div className="store-shell absolute inset-x-0 bottom-0 pb-10">
          <p className="text-xs tracking-[0.2em] text-on-inverse/70 uppercase">Journal · {formatDate(post.publishedAt)}</p>
          <h1 className="font-display mt-3 text-4xl text-on-inverse md:text-5xl">{post.title}</h1>
        </div>
      </div>
      <div className="store-shell pt-10">
        <div className="max-w-5xl">
        <p className="text-lg leading-relaxed text-ink-muted">{post.excerpt}</p>
        <p className="mt-3 text-sm text-ink-muted">{post.readingMinutes} min read</p>
        <HtmlContent html={post.body} className="mt-10" />
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
        </div>
      </div>
    </article>
  );
}

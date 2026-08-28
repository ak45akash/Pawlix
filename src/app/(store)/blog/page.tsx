"use client";

import { PostCard } from "@/components/store/post-card";
import { PageHero } from "@/components/store/page-hero";
import { PageSeo } from "@/components/store/page-seo";
import { publishedPosts } from "@/lib/content";
import { storeImages } from "@/config/images";
import { useDemo } from "@/lib/demo-store";

export default function BlogIndexPage() {
  const { state } = useDemo();
  const posts = publishedPosts(state, "blog");

  return (
    <>
      <PageSeo
        title="Pet care journal"
        description="Notes from the Pawlix shop floor: how we choose food, toys and everyday habits for dogs, cats and birds."
        path="/blog"
        keywords={["pet blog", "dog food advice", "cat care", "Pawlix journal"]}
      />

      <PageHero
        eyebrow="Journal"
        title="Notes from the shop floor."
        description="How we buy, how we feed, and the small habits that make a calmer home — written by the people who stock the shelves."
        image={storeImages.pages.blog.hero}
        imageAlt="Dogs on a walk — everyday pet care topics from Pawlix"
      />

      <main className="store-shell py-16 lg:py-20">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm tracking-[0.2em] text-accent uppercase">Latest posts</p>
            <h2 className="font-display mt-2 text-3xl md:text-4xl">Read at your pace.</h2>
            <p className="mt-3 max-w-xl text-ink-muted">
              Short pieces on food, walks, and the quiet parts of living with dogs, cats and birds.
            </p>
          </div>
          <p className="text-sm text-ink-muted">{posts.length} articles</p>
        </div>

        {posts.length ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-border bg-surface p-10 text-center text-ink-muted">
            No journal posts yet.
          </p>
        )}
      </main>
    </>
  );
}

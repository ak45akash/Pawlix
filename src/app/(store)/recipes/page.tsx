"use client";

import { PostCard } from "@/components/store/post-card";
import { PageHero } from "@/components/store/page-hero";
import { PageSeo } from "@/components/store/page-seo";
import { publishedPosts } from "@/lib/content";
import { useDemo } from "@/lib/demo-store";

const heroImage =
  "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=2000&q=80";

export default function RecipesIndexPage() {
  const { state } = useDemo();
  const posts = publishedPosts(state, "recipe");

  return (
    <>
      <PageSeo
        title="Homemade pet recipes"
        description="Simple bowls and toppers for dogs, cats and birds. Short kitchen notes from the Pawlix team."
        path="/recipes"
        keywords={["homemade pet recipes", "dog recipes", "cat recipes", "bird food"]}
      />

      <PageHero
        eyebrow="Recipes"
        title="Simple bowls and toppers."
        description="Short kitchen notes for dogs, cats and birds — the kind of feeding ideas we share at the counter in Chandigarh."
        image={heroImage}
        imageAlt="Fresh pet food ingredients — homemade recipe inspiration from Pawlix"
      />

      <main className="store-shell py-16 lg:py-20">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm tracking-[0.2em] text-accent uppercase">From our kitchen</p>
            <h2 className="font-display mt-2 text-3xl md:text-4xl">Small recipes, clearly written.</h2>
            <p className="mt-3 max-w-xl text-ink-muted">
              Toppers, lick mats, and gentle additions — nothing fussy, nothing you need a chef for.
            </p>
          </div>
          <p className="text-sm text-ink-muted">{posts.length} recipes</p>
        </div>

        {posts.length ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-border bg-surface p-10 text-center text-ink-muted">
            No recipes yet.
          </p>
        )}
      </main>
    </>
  );
}

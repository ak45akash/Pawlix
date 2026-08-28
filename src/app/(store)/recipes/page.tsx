"use client";

import { PostCard } from "@/components/store/post-card";
import { PageSeo } from "@/components/store/page-seo";
import { publishedPosts } from "@/lib/content";
import { useDemo } from "@/lib/demo-store";

export default function RecipesIndexPage() {
  const { state } = useDemo();
  const posts = publishedPosts(state, "recipe");

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
      <PageSeo
        title="Homemade pet recipes"
        description="Simple bowls and toppers for dogs, cats and birds. Short kitchen notes from the Pawlix team."
        path="/recipes"
        keywords={["homemade pet recipes", "dog recipes", "cat recipes", "bird food"]}
      />
      <p className="text-sm tracking-[0.2em] text-accent uppercase">Recipes</p>
      <h1 className="font-display mt-3 max-w-2xl text-4xl leading-tight md:text-5xl">Simple bowls and toppers.</h1>
      <p className="mt-4 max-w-xl text-ink-muted">
        Short kitchen notes for dogs, cats and birds. Edit them in the admin — the storefront updates immediately.
      </p>
      <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {!posts.length ? <p className="mt-8 text-ink-muted">No recipes yet.</p> : null}
    </main>
  );
}

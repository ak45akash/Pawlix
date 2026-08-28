"use client";

import { PostCard } from "@/components/store/post-card";
import { publishedPosts } from "@/lib/content";
import { useDemo } from "@/lib/demo-store";

export default function BlogIndexPage() {
  const { state } = useDemo();
  const posts = publishedPosts(state, "blog");

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
      <p className="text-sm tracking-[0.2em] text-accent uppercase">Journal</p>
      <h1 className="font-display mt-3 max-w-2xl text-4xl leading-tight md:text-5xl">Notes from the shop floor.</h1>
      <p className="mt-4 max-w-xl text-ink-muted">
        How we buy, how we feed, and the small habits that make a calmer home. Written in the admin, published here.
      </p>
      <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {!posts.length ? <p className="mt-8 text-ink-muted">No journal posts yet.</p> : null}
    </main>
  );
}

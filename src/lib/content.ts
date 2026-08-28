import type { ContentKind, ContentPost, DemoState } from "@/types/catalog";

export function shopHref(input?: { pet?: string; category?: string }) {
  const params = new URLSearchParams();
  if (input?.pet) params.set("pet", input.pet);
  if (input?.category) params.set("category", input.category);
  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}

export function publishedPosts(state: DemoState, kind?: ContentKind) {
  return state.posts
    .filter((post) => !post.archived && post.published && (!kind || post.kind === kind))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function featuredPosts(state: DemoState, kind?: ContentKind) {
  return publishedPosts(state, kind).filter((post) => post.featured);
}

export function findPost(state: DemoState, slugOrId: string, kind?: ContentKind) {
  return state.posts.find(
    (post) =>
      (!kind || post.kind === kind) &&
      !post.archived &&
      (post.slug === slugOrId || post.id === slugOrId),
  );
}

export function postPath(post: Pick<ContentPost, "kind" | "slug">) {
  return post.kind === "recipe" ? `/recipes/${post.slug}` : `/blog/${post.slug}`;
}

export function emptyPost(kind: ContentKind): Omit<ContentPost, "id"> {
  const now = new Date().toISOString();
  return {
    kind,
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    coverImage: "",
    petTypeIds: [],
    published: false,
    featured: false,
    readingMinutes: 3,
    servings: kind === "recipe" ? "" : "",
    prepMinutes: kind === "recipe" ? 10 : null,
    cookMinutes: kind === "recipe" ? 0 : null,
    seoTitle: "",
    seoDescription: "",
    focusKeyword: "",
    publishedAt: now,
    updatedAt: now,
    archived: false,
  };
}

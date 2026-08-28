import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/env";
import { seedState } from "@/data/seed";
import { postPath } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  const staticRoutes = ["", "/shop", "/blog", "/recipes", "/about", "/contact", "/shipping", "/returns", "/privacy", "/terms"].map(
    (path) => ({
      url: `${base}${path || "/"}`,
      lastModified: now,
      changeFrequency: path === "" || path === "/shop" ? "daily" : "weekly",
      priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.6,
    }),
  ) satisfies MetadataRoute.Sitemap;

  const products = seedState.products
    .filter((product) => product.published && !product.archived)
    .map((product) => ({
      url: `${base}/product/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const posts = seedState.posts
    .filter((post) => post.published && !post.archived)
    .map((post) => ({
      url: `${base}${postPath(post)}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...products, ...posts];
}

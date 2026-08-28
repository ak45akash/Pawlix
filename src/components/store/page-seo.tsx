"use client";

import { useEffect } from "react";
import { getSiteUrl } from "@/config/env";
import { siteConfig } from "@/config/site";

function upsertMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  const head = document.head;
  let node = head.querySelector(`${selector}[${attribute}="${key}"]`) as HTMLMetaElement | null;
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attribute, key);
    head.appendChild(node);
  }
  node.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  const head = document.head;
  let node = head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!node) {
    node = document.createElement("link");
    node.rel = rel;
    head.appendChild(node);
  }
  node.href = href;
}

export function PageSeo({
  title,
  description,
  path,
  image,
  type = "website",
  keywords = [],
  jsonLd,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "product";
  keywords?: string[];
  jsonLd?: object | object[];
}) {
  const url = getSiteUrl();
  const canonical = `${url}${path.startsWith("/") ? path : `/${path}`}`;
  const ogImage = image || `${url}/opengraph-image`;

  useEffect(() => {
    const fullTitle = title.includes(siteConfig.name) ? title : `${title} · ${siteConfig.name}`;
    document.title = fullTitle;
    upsertMeta("meta", "name", "description", description);
    upsertMeta("meta", "name", "robots", "index, follow");
    if (keywords.length) upsertMeta("meta", "name", "keywords", keywords.join(", "));
    upsertMeta("meta", "property", "og:title", fullTitle);
    upsertMeta("meta", "property", "og:description", description);
    upsertMeta("meta", "property", "og:type", type === "article" ? "article" : "website");
    upsertMeta("meta", "property", "og:url", canonical);
    upsertMeta("meta", "property", "og:image", ogImage);
    upsertMeta("meta", "property", "og:locale", "en_IN");
    upsertMeta("meta", "property", "og:site_name", siteConfig.name);
    upsertMeta("meta", "name", "twitter:card", "summary_large_image");
    upsertMeta("meta", "name", "twitter:title", fullTitle);
    upsertMeta("meta", "name", "twitter:description", description);
    upsertMeta("meta", "name", "twitter:image", ogImage);
    upsertLink("canonical", canonical);
  }, [title, description, canonical, ogImage, type, keywords]);

  const payload = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <>
      {payload.map((item, index) => (
        <script
          // Client pages store catalogue in localStorage, so JSON-LD is rendered here.
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}

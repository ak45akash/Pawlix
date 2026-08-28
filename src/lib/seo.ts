import { htmlToPlainText } from "./html.ts";
import { siteConfig } from "../config/site.ts";
import type { ContentPost, DemoState, Product, SiteSeo } from "../types/catalog.ts";

export type SeoSuggestion = {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  detail: string;
};

export type KeywordGroup = {
  id: string;
  label: string;
  hint: string;
  terms: string[];
};

export type WeakPageFix = {
  label: string;
  href: string;
  score: number;
  fix: string;
};

export type SeoImprovementPlan = {
  score: number;
  checks: SeoCheck[];
  pages: { id: string; kind: "site" | "blog" | "recipe" | "product"; label: string; href: string; score: number }[];
  suggestions: SeoSuggestion[];
  keywords: KeywordGroup[];
  weakPages: WeakPageFix[];
};

const CHECK_ADVICE: Record<string, Omit<SeoSuggestion, "id">> = {
  "focus-keyword": {
    priority: "high",
    title: "Set a focus keyword",
    detail: "Choose one phrase per page (e.g. “dog food Chandigarh”). Use the same wording in the SEO title, meta description, URL slug, and opening paragraph.",
  },
  "keyword-title": {
    priority: "high",
    title: "Put the keyword in the SEO title",
    detail: "Move the focus keyword near the start of the title. Example: “Dog Food in Chandigarh | Pawlix”. Keep the title between 30 and 60 characters.",
  },
  "title-length": {
    priority: "medium",
    title: "Adjust the SEO title length",
    detail: "Aim for 30–60 characters so the full title shows in Google. Trim filler words or add the city name if it is too short.",
  },
  "meta-length": {
    priority: "medium",
    title: "Lengthen or trim the meta description",
    detail: "Write 120–160 characters that mention the keyword once and explain why someone should click — delivery area, quality, or use case.",
  },
  "keyword-meta": {
    priority: "high",
    title: "Mention the keyword in the meta description",
    detail: "Include the focus phrase naturally in the description. Do not repeat it more than once.",
  },
  "keyword-slug": {
    priority: "medium",
    title: "Match the URL slug to the keyword",
    detail: "Use hyphenated words from the focus phrase (e.g. daily-bowl-chicken-rice). Avoid underscores and long slugs.",
  },
  "slug-shape": {
    priority: "low",
    title: "Shorten the URL slug",
    detail: "Keep slugs under 60 characters, lowercase, hyphen-separated. Remove stop words if the slug is too long.",
  },
  "keyword-intro": {
    priority: "high",
    title: "Use the keyword in the first paragraph",
    detail: "Search engines weigh the opening copy. Mention the focus phrase within the first 280 characters of body text.",
  },
  density: {
    priority: "medium",
    title: "Balance keyword density",
    detail: "Aim for 0.5–2.5% density. If it is too low, add the phrase once or twice in subheadings. If too high, rewrite sentences so it reads naturally.",
  },
  length: {
    priority: "high",
    title: "Add more body copy",
    detail: "Blog posts need roughly 700+ words, recipes 400+, products 120+. Add useful sections (ingredients, tips, FAQs) rather than padding.",
  },
  headings: {
    priority: "medium",
    title: "Add H2 subheadings",
    detail: "Break the article into scannable sections with descriptive H2s that include related terms (e.g. “What we look for in dog food”).",
  },
  cover: {
    priority: "medium",
    title: "Add a cover or product image",
    detail: "Set a unique image for sharing and image search. Use a descriptive file name and alt text that mentions the product or topic.",
  },
  alts: {
    priority: "medium",
    title: "Write alt text for inline images",
    detail: "Every inline image needs alt text describing what is shown. Include the keyword only when it fits naturally.",
  },
  links: {
    priority: "low",
    title: "Add internal links",
    detail: "Link to /shop, related products, or another journal post. One or two contextual links help crawlers and shoppers.",
  },
  "site-title": {
    priority: "high",
    title: "Improve the site SEO title",
    detail: `Include “pet food” or “pet store” and the Tricity (${siteConfig.location.formatted}). Example: “Pawlix — Pet Food & Accessories in Chandigarh, Mohali & Panchkula”.`,
  },
  "site-desc": {
    priority: "high",
    title: "Expand the site meta description",
    detail: "Write 120–160 characters covering what you sell, who you serve, and delivery. Mention dogs, cats, and birds if space allows.",
  },
  "site-keywords": {
    priority: "low",
    title: "Add more site keywords",
    detail: "List 4–8 comma-separated phrases you want the shop associated with — mix product types and local terms.",
  },
  "og-image": {
    priority: "medium",
    title: "Set a default share image",
    detail: "Add a 1200×630 px image URL for social previews when a page has no cover image.",
  },
  "focus-library": {
    priority: "high",
    title: "Build a focus keyword library",
    detail: "Add 3–6 phrases the whole shop should rank for (e.g. dog food, cat food, pet store Chandigarh). Assign one to each post and product.",
  },
  "post-keyword": {
    priority: "high",
    title: "Add focus keywords to posts",
    detail: "Open each blog and recipe in the audit table and set a focus keyword from your library before publishing.",
  },
  "post-avg": {
    priority: "high",
    title: "Raise average post scores",
    detail: "Edit the lowest-scoring posts first: complete SEO title, meta, keyword, H2s, and word count. Link each post to a shop category.",
  },
  "product-meta": {
    priority: "medium",
    title: "Complete product SEO fields",
    detail: "Every product needs a unique SEO title, meta description, and focus keyword (often the product category + pet type).",
  },
  "product-avg": {
    priority: "medium",
    title: "Improve product descriptions for search",
    detail: "Expand short descriptions with ingredients, sizing, and use cases. Unique copy per SKU beats repeating the brand blurb.",
  },
  indexable: {
    priority: "medium",
    title: "Publish more catalogue items",
    detail: "Search engines need enough product URLs to treat the site as a store. Publish at least six products with complete metadata.",
  },
  robots: {
    priority: "low",
    title: "Sitemap and robots are configured",
    detail: "No action needed — robots.txt and sitemap.xml are served automatically.",
  },
  locale: {
    priority: "low",
    title: "Set the site locale",
    detail: "Use en-IN for an Indian English storefront so language signals stay consistent.",
  },
};

export function suggestionsFromChecks(checks: SeoCheck[]): SeoSuggestion[] {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return checks
    .filter((item) => item.status !== "pass")
    .map((item) => {
      const advice = CHECK_ADVICE[item.id];
      return {
        id: item.id,
        priority: item.status === "fail" ? (advice?.priority ?? "high") : "medium",
        title: advice?.title ?? item.label,
        detail: advice?.detail ?? item.detail,
      };
    })
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

export function buildKeywordRecommendations(state: DemoState): KeywordGroup[] {
  const focus = uniqueTerms([...state.seo.focusKeywords, ...state.seo.keywords]);
  const local = uniqueTerms([
    `pet store ${siteConfig.location.storeCity}`,
    ...siteConfig.location.cities.flatMap((city) => [
      `pet shop ${city}`,
      `dog food ${city}`,
      `cat food ${city}`,
      `bird food ${city}`,
    ]),
    `pet store ${siteConfig.location.label}`,
    "pet accessories Tricity",
  ]);
  const catalogueText = [
    ...state.products.filter((product) => !product.archived).map((product) => `${product.name} ${product.shortDescription} ${product.focusKeyword}`),
    ...state.posts.filter((post) => !post.archived).map((post) => `${post.title} ${post.excerpt} ${post.focusKeyword}`),
  ].join(" ");
  const catalogue = extractKeywords(catalogueText, 12).map((hit) => hit.term);
  const starter = uniqueTerms([
    "dog food",
    "cat food",
    "bird food",
    "pet toys",
    "pet accessories",
    "homemade pet recipes",
    "premium pet food",
    ...focus,
  ]);

  return [
    {
      id: "focus",
      label: "Focus keywords",
      hint: "Assign one of these to each post and product. Save your library above to keep the list in sync.",
      terms: focus.length >= 3 ? focus : starter,
    },
    {
      id: "local",
      label: "Local search (Tricity)",
      hint: "Use in homepage copy, About, Contact, and product meta for city-level searches.",
      terms: local,
    },
    {
      id: "catalogue",
      label: "From your catalogue",
      hint: "Terms already appearing in product and content copy — good candidates for focus keywords.",
      terms: catalogue.length ? catalogue : starter.slice(0, 8),
    },
    {
      id: "gaps",
      label: "Suggested for pages without a keyword",
      hint: "Pages missing a focus keyword — open in the audit table and assign one of these.",
      terms: uniqueTerms(
        [
          ...state.posts
            .filter((post) => !post.archived && !post.focusKeyword.trim())
            .map((post) => suggestKeywordForPost(post, state)),
          ...state.products
            .filter((product) => !product.archived && !product.focusKeyword.trim())
            .map((product) => extractKeywords(`${product.name} ${product.shortDescription}`, 1)[0]?.term ?? product.name.toLowerCase()),
        ].filter(Boolean) as string[],
      ).slice(0, 10),
    },
  ].filter((group) => group.terms.length > 0);
}

export function siteImprovementPlan(state: DemoState): SeoImprovementPlan {
  const site = analyzeSite(state);
  const suggestions = suggestionsFromChecks(site.checks);
  const weakPages = site.pages
    .filter((page) => page.score < 75)
    .slice(0, 6)
    .map((page) => {
      const post = state.posts.find((item) => item.id === page.id);
      const product = state.products.find((item) => item.id === page.id);
      const report = post ? analyzePost(post) : product ? analyzeProduct(product) : null;
      const fix = report ? primaryFixFromReport(report) : "Open this page and complete SEO title, meta, and focus keyword.";
      return { label: page.label, href: page.href, score: page.score, fix };
    });

  return {
    score: site.score,
    checks: site.checks,
    pages: site.pages,
    suggestions,
    keywords: buildKeywordRecommendations(state),
    weakPages,
  };
}

function primaryFixFromReport(report: SeoReport) {
  const tips = suggestionsFromChecks(report.checks);
  return tips[0]?.detail ?? "Review SEO fields and add more descriptive copy.";
}

function suggestKeywordForPost(post: ContentPost, state: DemoState) {
  const hits = extractKeywords(`${post.title} ${post.excerpt}`, 3);
  if (hits.length) return hits[0].term;
  const pet = state.petTypes.find((item) => post.petTypeIds.includes(item.id));
  if (post.kind === "recipe") return pet ? `homemade ${pet.slug} food` : "homemade pet recipes";
  return pet ? `${pet.slug} care` : "pet care";
}

function uniqueTerms(terms: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const term of terms) {
    const normalized = term.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(term.trim());
  }
  return out;
}


export type SeoStatus = "pass" | "warn" | "fail";

export type SeoCheck = {
  id: string;
  label: string;
  status: SeoStatus;
  detail: string;
  weight: number;
};

export type KeywordHit = {
  term: string;
  count: number;
  density: number;
};

export type SeoReport = {
  score: number;
  checks: SeoCheck[];
  keywords: KeywordHit[];
  wordCount: number;
  title: string;
  description: string;
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "how",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "our",
  "that",
  "the",
  "their",
  "this",
  "to",
  "was",
  "we",
  "what",
  "with",
  "you",
  "your",
]);

export function extractKeywords(text: string, limit = 12): KeywordHit[] {
  const words = tokenize(text);
  const counts = new Map<string, number>();
  for (const word of words) {
    if (word.length < 3 || STOP_WORDS.has(word) || /^\d+$/.test(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  const phrases = extractPhrases(words);
  for (const [phrase, count] of phrases) {
    if (count < 2) continue;
    counts.set(phrase, (counts.get(phrase) ?? 0) + count);
  }
  const total = Math.max(words.length, 1);
  return [...counts.entries()]
    .map(([term, count]) => ({ term, count, density: Math.round((count / total) * 1000) / 10 }))
    .sort((a, b) => b.count - a.count || a.term.localeCompare(b.term))
    .slice(0, limit);
}

export function keywordIn(haystack: string, keyword: string) {
  const needle = keyword.trim().toLowerCase();
  if (!needle) return false;
  return haystack.toLowerCase().includes(needle);
}

export function analyzeContent(input: {
  kind: "blog" | "recipe" | "product" | "page";
  title: string;
  slug: string;
  body: string;
  excerpt?: string;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  coverImage?: string;
}): SeoReport {
  const title = input.seoTitle.trim() || input.title.trim();
  const description = input.seoDescription.trim() || (input.excerpt ?? "").trim();
  const bodyText = htmlToPlainText(input.body);
  const combined = `${input.title} ${title} ${description} ${bodyText}`;
  const wordCount = countWords(bodyText);
  const focus = input.focusKeyword.trim();
  const slug = input.slug.trim();
  const images = parseImages(input.body);
  const headings = parseTags(input.body, "h2");
  const links = parseHrefs(input.body);
  const minWords = input.kind === "recipe" ? 250 : input.kind === "product" ? 60 : input.kind === "page" ? 80 : 400;
  const goodWords = input.kind === "recipe" ? 400 : input.kind === "product" ? 120 : input.kind === "page" ? 150 : 700;
  const firstBlock = bodyText.slice(0, 280);

  const checks: SeoCheck[] = [
    check("focus-keyword", "Focus keyword set", focus ? "pass" : "fail", focus ? `Using “${focus}”.` : "Add a focus keyword to score against.", 10),
    check(
      "keyword-title",
      "Keyword in title",
      !focus ? "warn" : keywordIn(title, focus) ? "pass" : "fail",
      !focus ? "Set a focus keyword first." : keywordIn(title, focus) ? "The SEO title includes the keyword." : "Put the keyword near the start of the title.",
      12,
    ),
    check(
      "title-length",
      "Title length",
      title.length >= 30 && title.length <= 60 ? "pass" : title.length >= 20 && title.length <= 70 ? "warn" : "fail",
      `${title.length} characters. Aim for 30–60.`,
      8,
    ),
    check(
      "meta-length",
      "Meta description length",
      description.length >= 120 && description.length <= 160 ? "pass" : description.length >= 70 && description.length <= 180 ? "warn" : "fail",
      `${description.length} characters. Aim for 120–160.`,
      8,
    ),
    check(
      "keyword-meta",
      "Keyword in meta description",
      !focus ? "warn" : keywordIn(description, focus) ? "pass" : "fail",
      !focus ? "Set a focus keyword first." : keywordIn(description, focus) ? "The description mentions the keyword." : "Mention the keyword once in the description.",
      8,
    ),
    check(
      "keyword-slug",
      "Keyword in slug",
      !focus ? "warn" : slugIncludesKeyword(slug, focus) ? "pass" : "fail",
      !focus ? "Set a focus keyword first." : slugIncludesKeyword(slug, focus) ? "The URL slug includes the keyword." : "Use the keyword as hyphenated words in the slug.",
      8,
    ),
    check(
      "slug-shape",
      "Readable slug",
      slug.length > 2 && slug.length <= 60 && !slug.includes("_") ? "pass" : "warn",
      slug ? `/${slug}` : "Add a short hyphenated slug.",
      4,
    ),
    check(
      "keyword-intro",
      "Keyword in the opening",
      !focus ? "warn" : keywordIn(firstBlock, focus) ? "pass" : "fail",
      !focus ? "Set a focus keyword first." : keywordIn(firstBlock, focus) ? "The keyword appears near the start." : "Use the keyword in the first paragraph.",
      8,
    ),
    check(
      "density",
      "Keyword density",
      densityStatus(bodyText, focus),
      densityDetail(bodyText, focus),
      8,
    ),
    check(
      "length",
      "Body length",
      wordCount >= goodWords ? "pass" : wordCount >= minWords ? "warn" : "fail",
      `${wordCount} words. Aim for at least ${goodWords} for this type.`,
      10,
    ),
    check(
      "headings",
      "Subheadings",
      input.kind === "product" ? (bodyText.length > 0 ? "pass" : "warn") : headings.length ? "pass" : "fail",
      input.kind === "product" ? "Product copy does not need H2s." : headings.length ? `${headings.length} H2 heading${headings.length === 1 ? "" : "s"}.` : "Add at least one H2.",
      6,
    ),
    check(
      "cover",
      "Cover or product image",
      input.coverImage ? "pass" : "fail",
      input.coverImage ? "An image is set." : "Add a cover or product image.",
      4,
    ),
    check(
      "alts",
      "Image alt text",
      images.length === 0 ? "warn" : images.every((image) => image.hasAlt) ? "pass" : "fail",
      images.length === 0
        ? "No inline images to score."
        : `${images.filter((image) => image.hasAlt).length}/${images.length} images have alt text.`,
      4,
    ),
    check(
      "links",
      "Internal links",
      links.some((href) => href.startsWith("/")) ? "pass" : "warn",
      links.some((href) => href.startsWith("/")) ? "At least one internal link." : "Link to a shop, blog, or recipe page.",
      2,
    ),
  ];

  const score = scoreChecks(checks);
  return {
    score,
    checks,
    keywords: extractKeywords(combined),
    wordCount,
    title,
    description,
  };
}

export function analyzeSite(state: DemoState): {
  score: number;
  checks: SeoCheck[];
  pages: { id: string; kind: "site" | "blog" | "recipe" | "product"; label: string; href: string; score: number }[];
} {
  const seo = state.seo;
  const posts = state.posts.filter((post) => !post.archived);
  const products = state.products.filter((product) => !product.archived);
  const publishedProducts = state.products.filter((product) => product.published && !product.archived);
  const postReports = posts.map((post) => ({ post, report: analyzePost(post) }));
  const productReports = products.map((product) => ({ product, report: analyzeProduct(product) }));
  const avgPost =
    postReports.length === 0 ? 0 : Math.round(postReports.reduce((sum, row) => sum + row.report.score, 0) / postReports.length);
  const avgProduct =
    productReports.length === 0
      ? 0
      : Math.round(productReports.reduce((sum, row) => sum + row.report.score, 0) / productReports.length);
  const withKeyword = posts.filter((post) => post.focusKeyword.trim()).length;
  const withMeta = products.filter((product) => product.seoTitle.trim() && product.seoDescription.trim()).length;

  const checks: SeoCheck[] = [
    check("site-title", "Site title", seo.title.length >= 20 && seo.title.length <= 60 ? "pass" : "warn", `${seo.title.length} characters.`, 10),
    check(
      "site-desc",
      "Site description",
      seo.description.length >= 120 && seo.description.length <= 170 ? "pass" : seo.description.length >= 70 ? "warn" : "fail",
      `${seo.description.length} characters.`,
      10,
    ),
    check("site-keywords", "Site keywords", seo.keywords.length >= 4 ? "pass" : "warn", `${seo.keywords.length} keywords listed.`, 6),
    check("og-image", "Default share image", seo.ogImage ? "pass" : "fail", seo.ogImage ? "Open Graph image is set." : "Add a default social image.", 6),
    check(
      "focus-library",
      "Focus keyword library",
      seo.focusKeywords.length >= 3 ? "pass" : "warn",
      seo.focusKeywords.length ? seo.focusKeywords.join(", ") : "Add the phrases you want to rank for.",
      6,
    ),
    check(
      "post-keyword",
      "Posts with a focus keyword",
      posts.length === 0 ? "warn" : withKeyword / posts.length >= 0.8 ? "pass" : withKeyword / posts.length >= 0.4 ? "warn" : "fail",
      `${withKeyword}/${posts.length} posts have a focus keyword.`,
      10,
    ),
    check("post-avg", "Average post SEO score", avgPost >= 75 ? "pass" : avgPost >= 50 ? "warn" : "fail", `Average ${avgPost}/100 across journal and recipes.`, 14),
    check(
      "product-meta",
      "Products with SEO title and description",
      products.length === 0 ? "warn" : withMeta / products.length >= 0.8 ? "pass" : "warn",
      `${withMeta}/${products.length} products have both fields.`,
      8,
    ),
    check("product-avg", "Average product SEO score", avgProduct >= 70 ? "pass" : avgProduct >= 45 ? "warn" : "fail", `Average ${avgProduct}/100.`, 10),
    check(
      "indexable",
      "Published catalogue",
      publishedProducts.length >= 6 ? "pass" : "warn",
      `${publishedProducts.length} published products for search engines to index.`,
      6,
    ),
    check("robots", "robots.txt and sitemap", "pass", "robots.txt and sitemap.xml are served by the app.", 8),
    check("locale", "Language and locale", seo.locale ? "pass" : "warn", seo.locale || "Set a locale such as en-IN.", 6),
  ];

  const pages = [
    ...postReports.map(({ post, report }) => ({
      id: post.id,
      kind: post.kind,
      label: post.title,
      href: post.kind === "recipe" ? `/admin/recipes/${post.id}` : `/admin/blog/${post.id}`,
      score: report.score,
    })),
    ...productReports.map(({ product, report }) => ({
      id: product.id,
      kind: "product" as const,
      label: product.name,
      href: `/admin/products/${product.id}`,
      score: report.score,
    })),
  ].sort((a, b) => a.score - b.score);

  return { score: scoreChecks(checks), checks, pages };
}

export function analyzePost(post: ContentPost) {
  return analyzeContent({
    kind: post.kind,
    title: post.title,
    slug: post.slug,
    body: post.body,
    excerpt: post.excerpt,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    focusKeyword: post.focusKeyword,
    coverImage: post.coverImage,
  });
}

export function analyzeProduct(product: Product) {
  return analyzeContent({
    kind: "product",
    title: product.name,
    slug: product.slug,
    body: `${product.shortDescription}\n${product.description}`,
    excerpt: product.shortDescription,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    focusKeyword: product.focusKeyword || product.name,
    coverImage: product.image,
  });
}

export function serpPreview(title: string, description: string, path: string, host = "pawlix.com") {
  return {
    title: title.slice(0, 70),
    url: `${host}${path.startsWith("/") ? path : `/${path}`}`,
    description: description.slice(0, 160),
  };
}

export function slugFromKeyword(keyword: string) {
  return keyword
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function postPublicPath(post: Pick<ContentPost, "kind" | "slug">) {
  return post.kind === "recipe" ? `/recipes/${post.slug}` : `/blog/${post.slug}`;
}

export function siteJsonLd(seo: SiteSeo, url: string) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Pawlix",
      url,
      description: seo.description,
      logo: seo.ogImage,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Pawlix",
      url,
      description: seo.description,
      potentialAction: {
        "@type": "SearchAction",
        target: `${url}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];
}

export function articleJsonLd(post: ContentPost, url: string) {
  const path = `${url}${postPublicPath(post)}`;
  if (post.kind === "recipe") {
    return {
      "@context": "https://schema.org",
      "@type": "Recipe",
      name: post.title,
      description: post.seoDescription || post.excerpt,
      image: post.coverImage || undefined,
      recipeYield: post.servings || undefined,
      prepTime: post.prepMinutes != null ? `PT${post.prepMinutes}M` : undefined,
      cookTime: post.cookMinutes != null ? `PT${post.cookMinutes}M` : undefined,
      url: path,
    };
  }
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.coverImage || undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: path,
    url: path,
  };
}

export function productJsonLd(product: Product, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.seoDescription || product.shortDescription,
    image: product.image || undefined,
    sku: product.sku,
    url: `${url}/product/${product.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };
}

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function extractPhrases(words: string[]) {
  const phrases = new Map<string, number>();
  for (let index = 0; index < words.length - 1; index += 1) {
    const a = words[index];
    const b = words[index + 1];
    if (STOP_WORDS.has(a) || STOP_WORDS.has(b) || a.length < 3 || b.length < 3) continue;
    const phrase = `${a} ${b}`;
    phrases.set(phrase, (phrases.get(phrase) ?? 0) + 1);
  }
  return phrases;
}

function countWords(text: string) {
  return tokenize(text).length;
}

function parseImages(html: string) {
  return [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => {
    const tag = match[0];
    const alt = tag.match(/\balt\s*=\s*["']([^"']*)["']/i)?.[1] ?? "";
    return { hasAlt: Boolean(alt.trim()) };
  });
}

function parseTags(html: string, tag: string) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "gi"))].map((match) =>
    htmlToPlainText(match[1] ?? ""),
  );
}

function parseHrefs(html: string) {
  return [...html.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1] ?? "");
}

function slugIncludesKeyword(slug: string, keyword: string) {
  const slugWords = slug.replace(/-/g, " ");
  return keywordIn(slugWords, keyword) || slug.includes(slugFromKeyword(keyword));
}

function densityStatus(text: string, keyword: string): SeoStatus {
  if (!keyword) return "warn";
  const density = keywordDensity(text, keyword);
  if (density >= 0.5 && density <= 2.5) return "pass";
  if (density > 0 && density <= 4) return "warn";
  return "fail";
}

function densityDetail(text: string, keyword: string) {
  if (!keyword) return "Set a focus keyword first.";
  const density = keywordDensity(text, keyword);
  return `${density}% density. Aim for 0.5–2.5%.`;
}

function keywordDensity(text: string, keyword: string) {
  const words = tokenize(text);
  if (!words.length) return 0;
  const needle = tokenize(keyword);
  if (!needle.length) return 0;
  let count = 0;
  for (let index = 0; index <= words.length - needle.length; index += 1) {
    if (needle.every((word, offset) => words[index + offset] === word)) count += 1;
  }
  return Math.round((count / words.length) * 1000) / 10;
}

function check(id: string, label: string, status: SeoStatus, detail: string, weight: number): SeoCheck {
  return { id, label, status, detail, weight };
}

function scoreChecks(checks: SeoCheck[]) {
  const total = checks.reduce((sum, item) => sum + item.weight, 0) || 1;
  const earned = checks.reduce((sum, item) => {
    if (item.status === "pass") return sum + item.weight;
    if (item.status === "warn") return sum + item.weight * 0.5;
    return sum;
  }, 0);
  return Math.round((earned / total) * 100);
}

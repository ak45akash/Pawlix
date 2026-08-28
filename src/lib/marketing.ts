import { getSiteUrl } from "@/config/env";
import { siteConfig } from "@/config/site";
import { analyzePost, analyzeProduct, siteImprovementPlan } from "@/lib/seo";
import type { DemoState, MarketingCampaign, SiteAnnouncement } from "@/types/catalog";

export function buildCampaignUrl(campaign: Pick<MarketingCampaign, "path" | "source" | "medium" | "campaign">, host?: string) {
  const base = host ?? siteConfig.domain;
  const path = campaign.path.startsWith("/") ? campaign.path : `/${campaign.path}`;
  const params = new URLSearchParams({
    utm_source: campaign.source,
    utm_medium: campaign.medium,
    utm_campaign: campaign.campaign,
  });
  return `https://${base.replace(/^https?:\/\//, "")}${path}?${params.toString()}`;
}

export function activeAnnouncements(state: DemoState, on = new Date()) {
  const today = on.toISOString().slice(0, 10);
  return state.announcements
    .filter((item) => item.enabled && item.startsAt <= today && item.endsAt >= today)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function announcementIsLive(item: SiteAnnouncement, on = new Date()) {
  const today = on.toISOString().slice(0, 10);
  return item.enabled && item.startsAt <= today && item.endsAt >= today;
}

export function couponStatus(coupon: DemoState["coupons"][number], on = new Date()) {
  const today = on.toISOString().slice(0, 10);
  if (!coupon.active) return "off" as const;
  if (coupon.startsAt > today) return "scheduled" as const;
  if (coupon.endsAt < today) return "expired" as const;
  if (coupon.used >= coupon.usageLimit) return "exhausted" as const;
  return "active" as const;
}

export function marketingHubMetrics(state: DemoState) {
  const plan = siteImprovementPlan(state);
  const activeCoupons = state.coupons.filter((coupon) => couponStatus(coupon) === "active").length;
  const liveAnnouncements = activeAnnouncements(state).length;
  return {
    seoScore: plan.score,
    activeCoupons,
    liveAnnouncements,
    subscribers: state.newsletterSubscribers.length,
    campaigns: state.marketingCampaigns.length,
    weakPages: plan.weakPages.length,
  };
}

export function contentCalendarRows(state: DemoState) {
  return state.posts
    .filter((post) => !post.archived)
    .map((post) => {
      const report = analyzePost(post);
      return {
        id: post.id,
        kind: post.kind,
        title: post.title,
        published: post.published,
        featured: post.featured,
        focusKeyword: post.focusKeyword,
        score: report.score,
        updatedAt: post.updatedAt,
        publishedAt: post.publishedAt,
        href: post.kind === "recipe" ? `/admin/recipes/${post.id}` : `/admin/blog/${post.id}`,
      };
    })
    .sort((a, b) => {
      if (a.published !== b.published) return a.published ? 1 : -1;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
}

export function sharePreviewPages(state: DemoState) {
  const url = getSiteUrl();
  return [
    { label: "Homepage", path: "/", title: state.seo.title, description: state.seo.description, image: state.seo.ogImage },
    { label: "Shop", path: "/shop", title: `Shop pet products · ${siteConfig.name}`, description: state.seo.description, image: state.seo.ogImage },
    ...state.products
      .filter((product) => product.published && !product.archived)
      .slice(0, 6)
      .map((product) => ({
        label: product.name,
        path: `/product/${product.slug}`,
        title: product.seoTitle || product.name,
        description: product.seoDescription || product.shortDescription,
        image: product.image,
      })),
    ...state.posts
      .filter((post) => post.published && !post.archived)
      .slice(0, 4)
      .map((post) => ({
        label: post.title,
        path: post.kind === "recipe" ? `/recipes/${post.slug}` : `/blog/${post.slug}`,
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        image: post.coverImage,
      })),
  ].map((page) => ({ ...page, url: `${url}${page.path}` }));
}

export function listingCopyBlock(listings: DemoState["localListings"]) {
  return `${listings.businessName}
${listings.address}
Phone: ${listings.phone}
Email: ${listings.email}
${listings.googleBusinessUrl ? `Google: ${listings.googleBusinessUrl}` : ""}`.trim();
}

export function productSeoScores(state: DemoState) {
  return state.products
    .filter((product) => !product.archived)
    .map((product) => ({ product, score: analyzeProduct(product).score }));
}

import { siteConfig } from "@/config/site";
import type { LocalListings, MarketingCampaign, ReferralProgram, SiteAnnouncement } from "@/types/catalog";

export function defaultLocalListings(): LocalListings {
  return {
    businessName: siteConfig.name,
    phone: "+91 98765 43210",
    email: "hello@pawlix.com",
    address: `${siteConfig.location.storeCity} · delivery across ${siteConfig.location.formatted}`,
    googleBusinessUrl: "",
    instagramUrl: "https://instagram.com/pawlix",
    whatsappNumber: "+919876543210",
    listingNotes: "Keep NAP identical on Google, Instagram bio, and WhatsApp business profile.",
  };
}

export function defaultReferralProgram(): ReferralProgram {
  return {
    enabled: false,
    referrerReward: "₹150 off next order",
    refereeReward: "10% off first order",
    minOrder: 999,
    terms: "Referrer and friend each get one use. Not combinable with other coupons. Valid across Tricity delivery.",
  };
}

export const seedAnnouncements: SiteAnnouncement[] = [
  {
    id: "ann_ship",
    message: "Free delivery above ₹1,499 across Chandigarh, Mohali & Panchkula.",
    href: "/shipping",
    enabled: true,
    startsAt: "2026-08-01",
    endsAt: "2026-12-31",
    sortOrder: 1,
  },
  {
    id: "ann_welcome",
    message: "New here? Use WELCOME10 on your first order above ₹999.",
    href: "/shop",
    enabled: true,
    startsAt: "2026-08-01",
    endsAt: "2026-12-31",
    sortOrder: 2,
  },
];

export const seedMarketingCampaigns: MarketingCampaign[] = [
  {
    id: "camp_ig_shop",
    name: "Instagram shop link",
    path: "/shop",
    source: "instagram",
    medium: "social",
    campaign: "evergreen",
    couponCode: "",
    notes: "Bio link and story stickers",
    createdAt: "2026-08-10T10:00:00.000Z",
  },
  {
    id: "camp_wa_broadcast",
    name: "WhatsApp restock broadcast",
    path: "/shop?pet=dog",
    source: "whatsapp",
    medium: "message",
    campaign: "restock-aug",
    couponCode: "FLAT200",
    notes: "Send when dog food restocks land",
    createdAt: "2026-08-18T10:00:00.000Z",
  },
];

export const seedNewsletterSubscribers = [
  { id: "nl_1", email: "ananya@example.com", source: "homepage" as const, subscribedAt: "2026-08-12T09:00:00.000Z" },
  { id: "nl_2", email: "rahul@example.com", source: "homepage" as const, subscribedAt: "2026-08-20T14:30:00.000Z" },
  { id: "nl_3", email: "meera@example.com", source: "footer" as const, subscribedAt: "2026-08-25T11:15:00.000Z" },
];

export const suggestedCouponIdeas = [
  { code: "WELCOME10", label: "First order", detail: "10% off above ₹999 for new customers" },
  { code: "TRICITY1499", label: "Free shipping nudge", detail: "Pair with free delivery threshold messaging" },
  { code: "MONSOON10", label: "Seasonal", detail: "Rainy-day enrichment blog + 10% off toys" },
  { code: "FLAT200", label: "Basket builder", detail: "₹200 off orders above ₹2,499" },
];

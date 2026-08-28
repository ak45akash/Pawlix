import assert from "node:assert/strict";
import test from "node:test";
import { normalizeDemoState } from "./catalog.ts";

const seedAnnouncements = [
  {
    id: "ann_ship",
    message: "Free delivery above ₹1,499 across Chandigarh, Mohali & Panchkula.",
    href: "/shipping",
    enabled: true,
    startsAt: "2026-08-01",
    endsAt: "2026-12-31",
    sortOrder: 1,
  },
];

const seedMarketingCampaigns = [
  {
    id: "camp_ig_shop",
    name: "Instagram shop link",
    path: "/shop",
    source: "instagram",
    medium: "social",
    campaign: "evergreen",
    couponCode: "",
    notes: "Bio link",
    createdAt: "2026-08-10T10:00:00.000Z",
  },
];

function minimalState(overrides: Record<string, unknown> = {}) {
  return {
    adminRole: "admin",
    currentMemberId: "mem_admin",
    roles: [{ id: "role_admin", name: "Admin", slug: "admin", capabilities: ["*"], system: true }],
    members: [{ id: "mem_admin", name: "Admin", email: "admin@pawlix.com", roleId: "role_admin", createdAt: "2026-08-01T00:00:00.000Z" }],
    seo: {
      title: "Pawlix",
      description: "Pet shop",
      ogImage: "https://example.com/og.jpg",
      keywords: ["pet food"],
      focusKeywords: ["dog food"],
    },
    petTypes: [],
    categories: [],
    subcategories: [],
    brands: [],
    products: [],
    variants: [],
    orders: [],
    inventoryMovements: [],
    coupons: [],
    reviews: [],
    posts: [],
    homepageSections: [],
    auditLogs: [],
    settings: { shippingCharge: 79, freeShippingThreshold: 1499, deliveryNote: "", gstEnabled: true },
    ...overrides,
  };
}

test("normalizeDemoState fills marketing defaults when fields are missing", () => {
  const normalized = normalizeDemoState(minimalState() as never);
  assert.equal(normalized.announcements.length, 2);
  assert.equal(normalized.marketingCampaigns.length, 2);
  assert.equal(normalized.newsletterSubscribers.length, 0);
  assert.ok(normalized.localListings.businessName);
  assert.equal(normalized.referralProgram.enabled, false);
});

test("normalizeDemoState preserves custom announcements and campaigns", () => {
  const normalized = normalizeDemoState(
    minimalState({
      announcements: [{ ...seedAnnouncements[0]!, id: "custom", message: "Custom banner" }],
      marketingCampaigns: [{ ...seedMarketingCampaigns[0]!, id: "custom_camp", name: "Custom" }],
    }) as never,
  );
  assert.equal(normalized.announcements[0]?.message, "Custom banner");
  assert.equal(normalized.marketingCampaigns[0]?.name, "Custom");
});

test("normalizeDemoState merges partial local listings and referral settings", () => {
  const normalized = normalizeDemoState(
    minimalState({
      localListings: { businessName: "Pawlix", phone: "+91 11111 11111" },
      referralProgram: { enabled: true, referrerReward: "₹150", refereeReward: "10%", minOrder: 999, terms: "Demo" },
    }) as never,
  );
  assert.equal(normalized.localListings.phone, "+91 11111 11111");
  assert.equal(normalized.referralProgram.enabled, true);
});

test("normalizeDemoState adds focusKeyword defaults on products and posts", () => {
  const normalized = normalizeDemoState(
    minimalState({
      products: [{ id: "p1", name: "Bowl", slug: "bowl", focusKeyword: undefined }],
      posts: [{ id: "post1", title: "Hi", slug: "hi", kind: "blog", focusKeyword: undefined }],
    }) as never,
  );
  assert.equal(normalized.products[0]?.focusKeyword, "");
  assert.equal(normalized.posts[0]?.focusKeyword, "");
});

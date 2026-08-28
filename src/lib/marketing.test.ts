import assert from "node:assert/strict";
import test from "node:test";
import {
  activeAnnouncements,
  announcementIsLive,
  buildCampaignUrl,
  couponStatus,
  listingCopyBlock,
} from "./marketing.ts";

const aug29 = new Date("2026-08-29T12:00:00.000Z");

const sampleAnnouncement = {
  id: "ann_1",
  message: "Free delivery above ₹1,499",
  href: "/shipping",
  enabled: true,
  startsAt: "2026-08-01",
  endsAt: "2026-12-31",
  sortOrder: 1,
};

const sampleCoupon = {
  id: "cpn_1",
  code: "WELCOME10",
  type: "percentage" as const,
  value: 10,
  minOrder: 999,
  usageLimit: 200,
  used: 18,
  active: true,
  startsAt: "2026-08-01",
  endsAt: "2026-12-31",
};

test("buildCampaignUrl adds UTM params to a path", () => {
  const url = buildCampaignUrl(
    { path: "/shop", source: "instagram", medium: "social", campaign: "evergreen" },
    "pawlix.com",
  );
  assert.equal(url, "https://pawlix.com/shop?utm_source=instagram&utm_medium=social&utm_campaign=evergreen");
});

test("buildCampaignUrl normalizes paths without a leading slash", () => {
  const url = buildCampaignUrl(
    { path: "shop", source: "whatsapp", medium: "message", campaign: "restock" },
    "pawlix.com",
  );
  assert.ok(url.startsWith("https://pawlix.com/shop?"));
});

test("activeAnnouncements returns enabled items within date range", () => {
  const state = {
    announcements: [
      sampleAnnouncement,
      { ...sampleAnnouncement, id: "ann_2", enabled: false, sortOrder: 2 },
      { ...sampleAnnouncement, id: "ann_3", endsAt: "2026-08-01", sortOrder: 3 },
    ],
  } as Parameters<typeof activeAnnouncements>[0];
  const live = activeAnnouncements(state, aug29);
  assert.equal(live.length, 1);
  assert.equal(live[0]?.id, "ann_1");
});

test("announcementIsLive respects enabled flag and dates", () => {
  assert.equal(announcementIsLive(sampleAnnouncement, aug29), true);
  assert.equal(announcementIsLive({ ...sampleAnnouncement, enabled: false }, aug29), false);
  assert.equal(announcementIsLive({ ...sampleAnnouncement, endsAt: "2026-08-01" }, aug29), false);
});

test("couponStatus classifies active, scheduled, expired, and exhausted coupons", () => {
  assert.equal(couponStatus(sampleCoupon, aug29), "active");
  assert.equal(couponStatus({ ...sampleCoupon, active: false }, aug29), "off");
  assert.equal(couponStatus({ ...sampleCoupon, startsAt: "2026-12-01" }, aug29), "scheduled");
  assert.equal(couponStatus({ ...sampleCoupon, endsAt: "2026-08-01" }, aug29), "expired");
  assert.equal(couponStatus({ ...sampleCoupon, used: sampleCoupon.usageLimit }, aug29), "exhausted");
});

test("listingCopyBlock formats NAP details for paste into listings", () => {
  const block = listingCopyBlock({
    businessName: "Pawlix",
    phone: "+91 98765 43210",
    email: "hello@pawlix.com",
    address: "Chandigarh · Tricity",
    googleBusinessUrl: "https://maps.example/pawlix",
    instagramUrl: "https://instagram.com/pawlix",
    whatsappNumber: "+919876543210",
    listingNotes: "Keep NAP consistent.",
  });
  assert.match(block, /Pawlix/);
  assert.match(block, /hello@pawlix.com/);
  assert.match(block, /Phone:/);
  assert.match(block, /Google:/);
});

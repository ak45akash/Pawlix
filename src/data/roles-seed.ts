import type { AdminMember, AdminRoleRecord } from "@/types/catalog";
import { storeImages } from "@/config/images";
import { ALL_CAPABILITIES, ROLE_CAPABILITIES } from "@/lib/permissions/catalogue.ts";

export const seedRoles: AdminRoleRecord[] = [
  {
    id: "role_admin",
    name: "Admin",
    slug: "admin",
    description: "Full access, including team, roles, and deletes. This role cannot be removed.",
    capabilities: [...ALL_CAPABILITIES],
    system: true,
  },
  {
    id: "role_manager",
    name: "Manager",
    slug: "manager",
    description: "Runs the shop day to day: catalogue, orders, content, and SEO. Cannot delete catalogue records or edit roles.",
    capabilities: [...ROLE_CAPABILITIES.MANAGER],
    system: false,
  },
  {
    id: "role_staff",
    name: "Staff",
    slug: "staff",
    description: "Creates and edits catalogue and content, including SKUs. Cannot delete records or change access.",
    capabilities: [...ROLE_CAPABILITIES.STAFF],
    system: false,
  },
  {
    id: "role_editor",
    name: "Editor",
    slug: "editor",
    description: "Writes and publishes journal posts and recipes, and uses SEO tools.",
    capabilities: [...ROLE_CAPABILITIES.EDITOR],
    system: false,
  },
];

export const seedMembers: AdminMember[] = [
  {
    id: "mem_admin",
    name: "Simar Patel",
    email: "admin@pawlix.com",
    roleId: "role_admin",
    status: "active",
    createdAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "mem_manager",
    name: "Priya Shah",
    email: "manager@pawlix.com",
    roleId: "role_manager",
    status: "active",
    createdAt: "2026-07-12T00:00:00.000Z",
  },
  {
    id: "mem_staff",
    name: "Arjun Mehta",
    email: "staff@pawlix.com",
    roleId: "role_staff",
    status: "active",
    createdAt: "2026-08-02T00:00:00.000Z",
  },
  {
    id: "mem_editor",
    name: "Kavya Rao",
    email: "editor@pawlix.com",
    roleId: "role_editor",
    status: "active",
    createdAt: "2026-08-10T00:00:00.000Z",
  },
];

export function defaultSiteSeo() {
  return {
    title: "Pawlix — pet food, toys and accessories",
    description: "Premium pet food, toys, and accessories — thoughtfully chosen for everyday care.",
    keywords: ["pet food Chandigarh", "dog food", "cat food", "bird food", "pet toys", "pet accessories Mohali", "pet shop Panchkula", "pet store Tricity"],
    ogImage: storeImages.seo.ogDefault,
    locale: "en-IN",
    twitterHandle: "",
    focusKeywords: ["dog food", "cat food", "pet accessories", "homemade pet recipes"],
  };
}

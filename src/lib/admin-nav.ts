import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  Calendar,
  ClipboardList,
  FolderTree,
  Gift,
  LayoutDashboard,
  LayoutGrid,
  Link2,
  MapPin,
  Megaphone,
  Package,
  Search,
  Share2,
  Settings,
  Shield,
  ShoppingCart,
  Tag,
  Users,
  UserCog,
  UtensilsCrossed,
  Warehouse,
} from "lucide-react";
import type { Capability } from "@/lib/permissions/catalogue.ts";

export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  cap?: Capability;
  keywords: string[];
};

export type AdminNavGroup = {
  id: string;
  label: string;
  items: AdminNavItem[];
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        description: "Sales, orders, and inventory at a glance",
        icon: LayoutDashboard,
        keywords: ["home", "overview", "analytics", "metrics", "stats"],
      },
    ],
  },
  {
    id: "catalogue",
    label: "Catalogue",
    items: [
      {
        href: "/admin/products",
        label: "Products",
        description: "Manage product listings, pricing, and SKUs",
        icon: Package,
        cap: "catalogue.edit",
        keywords: ["sku", "items", "listings", "catalog"],
      },
      {
        href: "/admin/pet-types",
        label: "Pet types",
        description: "Dog, cat, bird and other pet groupings",
        icon: FolderTree,
        cap: "catalogue.edit",
        keywords: ["dog", "cat", "bird", "taxonomy"],
      },
      {
        href: "/admin/categories",
        label: "Categories",
        description: "Top-level product categories",
        icon: FolderTree,
        cap: "catalogue.edit",
        keywords: ["taxonomy", "groups", "food", "toys"],
      },
      {
        href: "/admin/subcategories",
        label: "Subcategories",
        description: "Nested categories within each category",
        icon: FolderTree,
        cap: "catalogue.edit",
        keywords: ["nested", "taxonomy", "groups"],
      },
      {
        href: "/admin/brands",
        label: "Brands",
        description: "Brand names shown on product pages",
        icon: Tag,
        cap: "catalogue.edit",
        keywords: ["manufacturer", "vendor", "labels"],
      },
      {
        href: "/admin/inventory",
        label: "Inventory",
        description: "Stock levels and movement history",
        icon: Warehouse,
        cap: "inventory.adjust",
        keywords: ["stock", "warehouse", "quantity", "movements"],
      },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    items: [
      {
        href: "/admin/orders",
        label: "Orders",
        description: "Online and offline order fulfilment",
        icon: ShoppingCart,
        cap: "orders.view",
        keywords: ["transactions", "fulfilment", "shipping", "checkout"],
      },
      {
        href: "/admin/customers",
        label: "Customers",
        description: "Customer profiles and purchase history",
        icon: Users,
        cap: "customers.view",
        keywords: ["buyers", "accounts", "profiles", "crm"],
      },
      {
        href: "/admin/coupons",
        label: "Coupons",
        description: "Discount codes and promotional offers",
        icon: Tag,
        cap: "coupons.manage",
        keywords: ["discounts", "promo", "codes", "offers"],
      },
    ],
  },
  {
    id: "content",
    label: "Content",
    items: [
      {
        href: "/admin/content",
        label: "Homepage",
        description: "Hero, featured products, and homepage sections",
        icon: ClipboardList,
        cap: "content.edit",
        keywords: ["landing", "sections", "hero", "featured"],
      },
      {
        href: "/admin/blog",
        label: "Blog",
        description: "Journal posts and pet care articles",
        icon: BookOpen,
        cap: "content.edit",
        keywords: ["journal", "posts", "articles", "news"],
      },
      {
        href: "/admin/recipes",
        label: "Recipes",
        description: "Pet food recipes and feeding guides",
        icon: UtensilsCrossed,
        cap: "content.edit",
        keywords: ["food", "bowls", "feeding", "guides"],
      },
      {
        href: "/admin/reviews",
        label: "Reviews",
        description: "Product reviews from customers",
        icon: ClipboardList,
        cap: "content.edit",
        keywords: ["ratings", "feedback", "testimonials"],
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    items: [
      {
        href: "/admin/marketing",
        label: "Overview",
        description: "Marketing hub — SEO, promos, campaigns, and growth tools",
        icon: LayoutGrid,
        cap: "seo.view",
        keywords: ["marketing", "growth", "hub", "overview"],
      },
      {
        href: "/admin/seo",
        label: "SEO",
        description: "Meta titles, descriptions, scores, and keyword suggestions",
        icon: Search,
        cap: "seo.view",
        keywords: ["search", "meta", "google", "sitemap", "keywords"],
      },
      {
        href: "/admin/marketing/promotions",
        label: "Promotions",
        description: "Coupons, usage stats, and offer ideas",
        icon: Tag,
        cap: "seo.view",
        keywords: ["coupons", "discounts", "offers", "promo"],
      },
      {
        href: "/admin/marketing/announcements",
        label: "Announcements",
        description: "Site-wide banners and alerts",
        icon: Megaphone,
        cap: "seo.view",
        keywords: ["banner", "alert", "announcement", "top bar"],
      },
      {
        href: "/admin/marketing/newsletter",
        label: "Newsletter",
        description: "Email subscribers and CSV export",
        icon: Users,
        cap: "seo.view",
        keywords: ["email", "subscribers", "mailing list"],
      },
      {
        href: "/admin/marketing/local",
        label: "Local listings",
        description: "Google, social profiles, and NAP consistency",
        icon: MapPin,
        cap: "seo.view",
        keywords: ["google business", "instagram", "whatsapp", "local seo"],
      },
      {
        href: "/admin/marketing/share",
        label: "Share previews",
        description: "Open Graph and social link previews",
        icon: Share2,
        cap: "seo.view",
        keywords: ["og", "social share", "preview", "whatsapp"],
      },
      {
        href: "/admin/marketing/campaigns",
        label: "Campaign links",
        description: "UTM tracked URLs for social and messaging",
        icon: Link2,
        cap: "seo.view",
        keywords: ["utm", "campaign", "tracking", "links"],
      },
      {
        href: "/admin/marketing/content",
        label: "Content calendar",
        description: "Blog and recipe publishing schedule by SEO score",
        icon: Calendar,
        cap: "seo.view",
        keywords: ["calendar", "blog", "recipes", "publish"],
      },
      {
        href: "/admin/marketing/referrals",
        label: "Referrals",
        description: "Refer-a-friend rewards program settings",
        icon: Gift,
        cap: "seo.view",
        keywords: ["referral", "refer a friend", "loyalty"],
      },
    ],
  },
  {
    id: "people",
    label: "People",
    items: [
      {
        href: "/admin/team",
        label: "Team",
        description: "Admin members and staff accounts",
        icon: UserCog,
        cap: "team.view",
        keywords: ["staff", "members", "users", "accounts"],
      },
      {
        href: "/admin/roles",
        label: "Roles",
        description: "Permissions and access control",
        icon: Shield,
        cap: "roles.manage",
        keywords: ["permissions", "access", "capabilities", "security"],
      },
    ],
  },
  {
    id: "insights",
    label: "Insights",
    items: [
      {
        href: "/admin/reports",
        label: "Reports",
        description: "Sales, profit, and channel breakdowns",
        icon: BarChart3,
        cap: "reports.view",
        keywords: ["analytics", "revenue", "profit", "cogs"],
      },
      {
        href: "/admin/audit",
        label: "Audit log",
        description: "History of important admin actions",
        icon: ClipboardList,
        cap: "audit.view",
        keywords: ["history", "activity", "changes", "log"],
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    items: [
      {
        href: "/admin/settings",
        label: "Store settings",
        description: "Shipping, GST, and general store options",
        icon: Settings,
        cap: "settings.edit",
        keywords: ["configuration", "shipping", "gst", "general"],
      },
    ],
  },
];

export function flattenAdminNav(groups = adminNavGroups) {
  return groups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.label, groupId: group.id })));
}

export function filterAdminNav(query: string, can: (cap: Capability) => boolean) {
  const needle = query.trim().toLowerCase();
  const visible = flattenAdminNav().filter((item) => !item.cap || can(item.cap));
  if (!needle) return visible;

  return visible.filter((item) => {
    const haystack = [item.label, item.description, item.group, ...item.keywords].join(" ").toLowerCase();
    return haystack.includes(needle);
  });
}

export function navGroupsForUser(can: (cap: Capability) => boolean) {
  return adminNavGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.cap || can(item.cap)),
    }))
    .filter((group) => group.items.length > 0);
}

export function isNavItemActive(pathname: string, href: string) {
  return pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));
}

export function groupContainsActive(pathname: string, group: AdminNavGroup) {
  return group.items.some((item) => isNavItemActive(pathname, item.href));
}

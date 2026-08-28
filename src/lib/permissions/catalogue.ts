export const CATALOGUE_CAPABILITIES = [
  "catalogue.create",
  "catalogue.edit",
  "catalogue.delete",
  "sku.edit",
  "sku.regenerate",
] as const;

export const ALL_CAPABILITIES = [
  ...CATALOGUE_CAPABILITIES,
  "content.create",
  "content.edit",
  "content.delete",
  "content.publish",
  "orders.view",
  "orders.edit",
  "customers.view",
  "coupons.manage",
  "inventory.adjust",
  "team.view",
  "team.manage",
  "roles.manage",
  "settings.edit",
  "seo.view",
  "seo.edit",
  "reports.view",
  "audit.view",
] as const;

export type CatalogueCapability = (typeof CATALOGUE_CAPABILITIES)[number];
export type Capability = (typeof ALL_CAPABILITIES)[number];

/** @deprecated Use role slugs from DemoState.roles. Kept for older demo cookies. */
export const ADMIN_ROLES = ["ADMIN", "STAFF"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number] | string;

export const CAPABILITY_GROUPS: { id: string; label: string; items: { id: Capability; label: string }[] }[] = [
  {
    id: "catalogue",
    label: "Catalogue",
    items: [
      { id: "catalogue.create", label: "Create products and taxonomy" },
      { id: "catalogue.edit", label: "Edit products and taxonomy" },
      { id: "catalogue.delete", label: "Delete catalogue records" },
      { id: "sku.edit", label: "Edit SKUs" },
      { id: "sku.regenerate", label: "Regenerate SKUs" },
    ],
  },
  {
    id: "content",
    label: "Content",
    items: [
      { id: "content.create", label: "Create blog posts and recipes" },
      { id: "content.edit", label: "Edit posts, recipes, and reviews" },
      { id: "content.delete", label: "Delete posts and recipes" },
      { id: "content.publish", label: "Publish to the storefront" },
    ],
  },
  {
    id: "commerce",
    label: "Commerce",
    items: [
      { id: "orders.view", label: "View orders" },
      { id: "orders.edit", label: "Update order status" },
      { id: "customers.view", label: "View customers" },
      { id: "coupons.manage", label: "Manage coupons" },
      { id: "inventory.adjust", label: "Adjust stock" },
    ],
  },
  {
    id: "team",
    label: "Team and access",
    items: [
      { id: "team.view", label: "View team members" },
      { id: "team.manage", label: "Add, edit, and remove members" },
      { id: "roles.manage", label: "Create and edit roles and rights" },
    ],
  },
  {
    id: "site",
    label: "Site",
    items: [
      { id: "settings.edit", label: "Edit store settings" },
      { id: "seo.view", label: "View SEO scores and tools" },
      { id: "seo.edit", label: "Edit site SEO settings" },
      { id: "reports.view", label: "View reports" },
      { id: "audit.view", label: "View the audit log" },
    ],
  },
];

/**
 * Built-in role capability maps. ADMIN has full rights, including delete.
 * STAFF can create and edit (including SKUs) but cannot delete.
 * Server actions must call assertCapability — never rely on hiding buttons.
 */
export const ROLE_CAPABILITIES: Record<"ADMIN" | "STAFF" | "MANAGER" | "EDITOR", readonly Capability[]> = {
  ADMIN: ALL_CAPABILITIES,
  STAFF: [
    "catalogue.create",
    "catalogue.edit",
    "sku.edit",
    "sku.regenerate",
    "content.create",
    "content.edit",
    "content.publish",
    "orders.view",
    "orders.edit",
    "customers.view",
    "inventory.adjust",
    "seo.view",
    "reports.view",
  ],
  MANAGER: [
    "catalogue.create",
    "catalogue.edit",
    "sku.edit",
    "sku.regenerate",
    "content.create",
    "content.edit",
    "content.delete",
    "content.publish",
    "orders.view",
    "orders.edit",
    "customers.view",
    "coupons.manage",
    "inventory.adjust",
    "team.view",
    "settings.edit",
    "seo.view",
    "seo.edit",
    "reports.view",
    "audit.view",
  ],
  EDITOR: ["content.create", "content.edit", "content.publish", "seo.view", "seo.edit", "reports.view"],
};

export function isCapability(value: string): value is Capability {
  return (ALL_CAPABILITIES as readonly string[]).includes(value);
}

export function hasCapability(capabilities: readonly string[], capability: Capability) {
  return capabilities.includes(capability);
}

export function assertCapability(capabilities: readonly string[], capability: Capability) {
  if (!hasCapability(capabilities, capability)) {
    throw new Error(`Not allowed: ${capability}`);
  }
}

export function canEditCatalogue(capabilities: readonly string[]) {
  return hasCapability(capabilities, "catalogue.edit");
}

export function canDeleteCatalogue(capabilities: readonly string[]) {
  return hasCapability(capabilities, "catalogue.delete");
}

export function canEditSku(capabilities: readonly string[]) {
  return hasCapability(capabilities, "sku.edit");
}

export function navVisible(capabilities: readonly string[], required?: Capability) {
  if (!required) return true;
  return hasCapability(capabilities, required);
}

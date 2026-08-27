export const ADMIN_ROLES = ["ADMIN", "STAFF"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const CATALOGUE_CAPABILITIES = [
  "catalogue.create",
  "catalogue.edit",
  "catalogue.delete",
  "sku.edit",
  "sku.regenerate",
] as const;

export type CatalogueCapability = (typeof CATALOGUE_CAPABILITIES)[number];

/**
 * ADMIN has full catalogue rights, including delete.
 * STAFF can create and edit (including SKUs) but cannot delete.
 * Server actions must call assertCapability — never rely on hiding buttons.
 */
export const ROLE_CAPABILITIES: Record<AdminRole, readonly CatalogueCapability[]> = {
  ADMIN: [
    "catalogue.create",
    "catalogue.edit",
    "catalogue.delete",
    "sku.edit",
    "sku.regenerate",
  ],
  STAFF: ["catalogue.create", "catalogue.edit", "sku.edit", "sku.regenerate"],
};

export function hasCapability(role: AdminRole, capability: CatalogueCapability) {
  return ROLE_CAPABILITIES[role].includes(capability);
}

export function assertCapability(role: AdminRole, capability: CatalogueCapability) {
  if (!hasCapability(role, capability)) {
    throw new Error(`Not allowed: ${capability}`);
  }
}

export function canEditCatalogue(role: AdminRole) {
  return hasCapability(role, "catalogue.edit");
}

export function canDeleteCatalogue(role: AdminRole) {
  return hasCapability(role, "catalogue.delete");
}

export function canEditSku(role: AdminRole) {
  return hasCapability(role, "sku.edit");
}

import type { Category, ContentPost, DemoState, Product, ProductVariant } from "@/types/catalog";
import { defaultLocalListings, defaultReferralProgram, seedAnnouncements, seedMarketingCampaigns } from "@/data/marketing-seed";
import { defaultSiteSettings } from "@/data/settings-seed";
import { defaultSiteSeo, seedMembers, seedRoles } from "@/data/roles-seed";
import { buildDefaultAdminCredentials } from "@/lib/admin-auth";
import { formatBusinessHours, normalizeWeeklyBusinessHours } from "@/lib/business-hours";

export function activeProducts(state: DemoState) {
  return state.products
    .filter((product) => !product.archived)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function storefrontProducts(state: DemoState) {
  return activeProducts(state).filter((product) => product.published);
}

export function productVariants(state: DemoState, productId: string) {
  return state.variants.filter((variant) => variant.productId === productId);
}

export function availableStock(state: DemoState, product: Product, variantId?: string | null) {
  if (variantId) {
    return state.variants.find((variant) => variant.id === variantId)?.stock ?? 0;
  }
  const variants = productVariants(state, product.id);
  if (variants.length) {
    return variants.reduce((sum, variant) => sum + variant.stock, 0);
  }
  return product.stock;
}

export function sellingPrice(state: DemoState, product: Product, variant?: ProductVariant | null) {
  if (variant) return variant.price;
  const variants = productVariants(state, product.id);
  if (variants.length) return Math.min(...variants.map((item) => item.price));
  return product.price;
}

export function displayMrp(state: DemoState, product: Product, variant?: ProductVariant | null) {
  if (variant) return variant.mrp ?? product.mrp;
  return product.mrp;
}

export function allSkus(state: DemoState, except?: { productId?: string; variantId?: string }) {
  const productSkus = state.products
    .filter((product) => product.id !== except?.productId)
    .map((product) => product.sku);
  const variantSkus = state.variants
    .filter((variant) => variant.id !== except?.variantId)
    .map((variant) => variant.sku);
  return [...productSkus, ...variantSkus];
}

export function petTypeById(state: DemoState, id: string) {
  return state.petTypes.find((item) => item.id === id);
}

export function categoryById(state: DemoState, id: string) {
  return state.categories.find((item) => item.id === id);
}

export function normalizeDemoState(state: DemoState): DemoState {
  const roles = Array.isArray(state.roles) && state.roles.length ? state.roles : seedRoles;
  const members = Array.isArray(state.members) && state.members.length ? state.members : seedMembers;
  const currentMemberId =
    state.currentMemberId && members.some((member) => member.id === state.currentMemberId)
      ? state.currentMemberId
      : members[0]?.id ?? "mem_admin";
  const roleSlug = roles.find((role) => role.id === members.find((member) => member.id === currentMemberId)?.roleId)?.slug ?? "admin";

  return {
    ...state,
    roles,
    members,
    currentMemberId,
    adminRole: roleSlug,
    seo: {
      ...defaultSiteSeo(),
      ...(state.seo ?? {}),
      keywords: state.seo?.keywords?.length ? state.seo.keywords : defaultSiteSeo().keywords,
      focusKeywords: state.seo?.focusKeywords?.length ? state.seo.focusKeywords : defaultSiteSeo().focusKeywords,
    },
    posts: (Array.isArray(state.posts) ? state.posts : []).map((post: ContentPost) => ({
      ...post,
      focusKeyword: post.focusKeyword ?? "",
    })),
    products: state.products.map((product: Product) => ({
      ...product,
      focusKeyword: product.focusKeyword ?? "",
    })),
    categories: state.categories.map((item) => {
      const legacy = item as Category & { petTypeId?: string };
      if (Array.isArray(legacy.petTypeIds)) return item;
      return { ...item, petTypeIds: legacy.petTypeId ? [legacy.petTypeId] : [] };
    }),
    announcements: Array.isArray(state.announcements) && state.announcements.length ? state.announcements : seedAnnouncements,
    newsletterSubscribers: Array.isArray(state.newsletterSubscribers) ? state.newsletterSubscribers : [],
    localListings: { ...defaultLocalListings(), ...(state.localListings ?? {}) },
    marketingCampaigns: Array.isArray(state.marketingCampaigns) && state.marketingCampaigns.length ? state.marketingCampaigns : seedMarketingCampaigns,
    referralProgram: { ...defaultReferralProgram(), ...(state.referralProgram ?? {}) },
    settings: (() => {
      const merged = { ...defaultSiteSettings(), ...(state.settings ?? {}) };
      const businessHours = normalizeWeeklyBusinessHours(merged.businessHours);
      return {
        ...merged,
        businessHours,
        supportHours: formatBusinessHours(businessHours),
      };
    })(),
    adminCredentials:
      state.adminCredentials && Object.keys(state.adminCredentials).length
        ? state.adminCredentials
        : buildDefaultAdminCredentials(members),
    adminPasswordResets: Array.isArray(state.adminPasswordResets) ? state.adminPasswordResets : [],
  };
}

export function categoriesForPet(state: DemoState, petTypeId: string) {
  return state.categories
    .filter((item) => !item.archived && item.petTypeIds.includes(petTypeId))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function subcategoriesForCategory(state: DemoState, categoryId: string) {
  return state.subcategories
    .filter((item) => item.categoryId === categoryId && !item.archived)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function findProduct(state: DemoState, slugOrId: string) {
  return state.products.find((product) => product.slug === slugOrId || product.id === slugOrId);
}

export function stockStatus(quantity: number, threshold: number) {
  if (quantity <= 0) return "out" as const;
  if (quantity <= threshold) return "low" as const;
  return "ok" as const;
}

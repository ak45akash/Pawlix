import type { DemoState, Product, ProductVariant } from "@/types/catalog";

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

export function categoriesForPet(state: DemoState, petTypeId: string) {
  return state.categories
    .filter((item) => item.petTypeId === petTypeId && !item.archived)
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

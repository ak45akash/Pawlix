"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { seedState } from "@/data/seed";
import { resolveSku } from "@/features/products/sku.ts";
import { createBrowserStore } from "@/lib/browser-store";
import { allSkus, normalizeDemoState, productVariants } from "@/lib/catalog";
import { assertCapability, type AdminRole } from "@/lib/permissions/catalogue.ts";
import { createId } from "@/lib/slug";
import type {
  AuditLog,
  Brand,
  Category,
  Coupon,
  DemoState,
  HomepageSection,
  InventoryMovement,
  Order,
  ContentPost,
  PetType,
  Product,
  ProductVariant,
  Review,
  Subcategory,
} from "@/types/catalog";

const demoStore = createBrowserStore<DemoState>("pawlix-demo-state-v4", seedState);

type DemoContextValue = {
  state: DemoState;
  role: AdminRole;
  reset: () => void;
  setRole: (role: AdminRole) => void;
  savePetType: (item: Omit<PetType, "id" | "archived"> & { id?: string }) => void;
  saveCategory: (item: Omit<Category, "id" | "archived"> & { id?: string }) => void;
  saveSubcategory: (item: Omit<Subcategory, "id" | "archived"> & { id?: string }) => void;
  saveBrand: (item: Omit<Brand, "id" | "archived"> & { id?: string }) => void;
  deleteEntity: (
    collection: "petTypes" | "categories" | "subcategories" | "brands" | "products" | "coupons" | "posts",
    id: string,
  ) => void;
  saveProduct: (product: Product, variants: ProductVariant[]) => void;
  savePost: (item: ContentPost) => void;
  duplicateProduct: (id: string) => string;
  adjustStock: (input: {
    productId: string;
    variantId: string | null;
    type: InventoryMovement["type"];
    quantity: number;
    reason: string;
    note?: string;
    salePrice?: number;
  }) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  saveCoupon: (item: Omit<Coupon, "id" | "used"> & { id?: string; used?: number }) => void;
  saveSection: (item: HomepageSection) => void;
  saveReview: (item: Review) => void;
  saveSettings: (settings: DemoState["settings"]) => void;
  addOrder: (order: Order) => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

function log(actor: string, action: string, entity: string, entityId: string, detail: string): AuditLog {
  return {
    id: createId("aud"),
    actor,
    action,
    entity,
    entityId,
    detail,
    createdAt: new Date().toISOString(),
  };
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(demoStore.subscribe, demoStore.getSnapshot, demoStore.getServerSnapshot);
  const state = useMemo(() => normalizeDemoState(raw), [raw]);

  const value = useMemo<DemoContextValue>(() => {
    const actor = state.adminRole === "ADMIN" ? "Admin" : "Staff";
    const role = state.adminRole;

    return {
      state,
      role,
      reset: () => demoStore.clear(),
      setRole: (next) => demoStore.set((current) => ({ ...current, adminRole: next })),
      savePetType: (item) => {
        assertCapability(role, item.id ? "catalogue.edit" : "catalogue.create");
        demoStore.set((current) => {
          const next = { ...item, id: item.id ?? createId("pet"), archived: false };
          const petTypes = item.id
            ? current.petTypes.map((row) => (row.id === item.id ? { ...row, ...next } : row))
            : [...current.petTypes, next];
          return {
            ...current,
            petTypes,
            auditLogs: [log(actor, item.id ? "updated" : "created", "pet_type", next.id, next.name), ...current.auditLogs],
          };
        });
      },
      saveCategory: (item) => {
        assertCapability(role, item.id ? "catalogue.edit" : "catalogue.create");
        demoStore.set((current) => {
          const next = { ...item, id: item.id ?? createId("cat"), archived: false };
          const categories = item.id
            ? current.categories.map((row) => (row.id === item.id ? { ...row, ...next } : row))
            : [...current.categories, next];
          return {
            ...current,
            categories,
            auditLogs: [log(actor, item.id ? "updated" : "created", "category", next.id, next.name), ...current.auditLogs],
          };
        });
      },
      saveSubcategory: (item) => {
        assertCapability(role, item.id ? "catalogue.edit" : "catalogue.create");
        demoStore.set((current) => {
          const next = { ...item, id: item.id ?? createId("sub"), archived: false };
          const subcategories = item.id
            ? current.subcategories.map((row) => (row.id === item.id ? { ...row, ...next } : row))
            : [...current.subcategories, next];
          return {
            ...current,
            subcategories,
            auditLogs: [log(actor, item.id ? "updated" : "created", "subcategory", next.id, next.name), ...current.auditLogs],
          };
        });
      },
      saveBrand: (item) => {
        assertCapability(role, item.id ? "catalogue.edit" : "catalogue.create");
        demoStore.set((current) => {
          const next = { ...item, id: item.id ?? createId("br"), archived: false };
          const brands = item.id
            ? current.brands.map((row) => (row.id === item.id ? { ...row, ...next } : row))
            : [...current.brands, next];
          return {
            ...current,
            brands,
            auditLogs: [log(actor, item.id ? "updated" : "created", "brand", next.id, next.name), ...current.auditLogs],
          };
        });
      },
      deleteEntity: (collection, id) => {
        assertCapability(role, "catalogue.delete");
        demoStore.set((current) => {
          const remaining = (current[collection] as { id: string }[]).filter((row) => row.id !== id);
          return {
            ...current,
            [collection]: remaining,
            variants: collection === "products" ? current.variants.filter((variant) => variant.productId !== id) : current.variants,
            auditLogs: [log(actor, "deleted", collection, id, id), ...current.auditLogs],
          };
        });
      },
      saveProduct: (product, variants) => {
        const exists = state.products.some((row) => row.id === product.id);
        assertCapability(role, exists ? "catalogue.edit" : "catalogue.create");
        demoStore.set((current) => {
          const already = current.products.some((row) => row.id === product.id);
          const products = already
            ? current.products.map((row) => (row.id === product.id ? product : row))
            : [...current.products, product];
          const otherVariants = current.variants.filter((variant) => variant.productId !== product.id);
          return {
            ...current,
            products,
            variants: [...otherVariants, ...variants],
            auditLogs: [log(actor, already ? "updated" : "created", "product", product.id, product.name), ...current.auditLogs],
          };
        });
      },
      savePost: (item) => {
        assertCapability(role, item.id && state.posts.some((row) => row.id === item.id) ? "catalogue.edit" : "catalogue.create");
        try {
          demoStore.set((current) => {
            const list = current.posts ?? [];
            const already = list.some((row) => row.id === item.id);
            const posts = already
              ? list.map((row) => (row.id === item.id ? item : row))
              : [...list, item];
            return {
              ...current,
              posts,
              auditLogs: [log(actor, already ? "updated" : "created", item.kind, item.id, item.title), ...current.auditLogs],
            };
          });
        } catch {
          throw new Error("Could not save. Images may be too large — turn on Optimize images and try again.");
        }
      },
      duplicateProduct: (id) => {
        assertCapability(role, "catalogue.create");
        const source = state.products.find((row) => row.id === id);
        if (!source) return id;
        const newId = createId("prd");
        const copy: Product = {
          ...source,
          id: newId,
          name: `${source.name} copy`,
          slug: `${source.slug}-copy-${newId.slice(-4)}`,
          sku: resolveSku({
            sequential: state.products.length + 1,
            petTypeSlug: state.petTypes.find((item) => item.id === source.petTypeId)?.slug,
            categorySlug: state.categories.find((item) => item.id === source.categoryId)?.slug,
            existingSkus: allSkus(state),
          }).sku,
          skuSource: "auto",
          published: false,
          featured: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const copies = productVariants(state, id).map((variant) => ({
          ...variant,
          id: createId("var"),
          productId: newId,
          sku: `${copy.sku}-${variant.name.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 8)}`,
        }));
        demoStore.set((current) => ({
          ...current,
          products: [...current.products, copy],
          variants: [...current.variants, ...copies],
          auditLogs: [log(actor, "duplicated", "product", newId, copy.name), ...current.auditLogs],
        }));
        return newId;
      },
      adjustStock: (input) => {
        assertCapability(role, "catalogue.edit");
        demoStore.set((current) => {
          const product = current.products.find((row) => row.id === input.productId);
          if (!product) return current;
          const variant = input.variantId
            ? current.variants.find((row) => row.id === input.variantId)
            : undefined;
          const previous = variant ? variant.stock : product.stock;
          const signed =
            input.type === "OFFLINE_SALE" ||
            input.type === "ONLINE_SALE" ||
            input.type === "DAMAGED"
              ? -Math.abs(input.quantity)
              : input.type === "STOCK_ADJUSTMENT"
                ? input.quantity
                : Math.abs(input.quantity);
          const nextQty = previous + signed;
          if (nextQty < 0) {
            throw new Error("Stock cannot go below zero.");
          }
          const movement: InventoryMovement = {
            id: createId("mov"),
            productId: input.productId,
            variantId: input.variantId,
            type: input.type,
            quantityChange: signed,
            previousQuantity: previous,
            newQuantity: nextQty,
            reason: input.reason,
            note: input.note ?? "",
            actor,
            createdAt: new Date().toISOString(),
          };
          return {
            ...current,
            products: variant
              ? current.products
              : current.products.map((row) => (row.id === product.id ? { ...row, stock: nextQty } : row)),
            variants: variant
              ? current.variants.map((row) => (row.id === variant.id ? { ...row, stock: nextQty } : row))
              : current.variants,
            movements: [movement, ...current.movements],
            auditLogs: [log(actor, "stock.changed", "product", product.id, `${input.type} ${signed}`), ...current.auditLogs],
          };
        });
      },
      updateOrderStatus: (id, status) => {
        assertCapability(role, "catalogue.edit");
        demoStore.set((current) => ({
          ...current,
          orders: current.orders.map((order) => (order.id === id ? { ...order, status } : order)),
          auditLogs: [log(actor, "order.status", "order", id, status), ...current.auditLogs],
        }));
      },
      saveCoupon: (item) => {
        assertCapability(role, item.id ? "catalogue.edit" : "catalogue.create");
        demoStore.set((current) => {
          const next = { ...item, id: item.id ?? createId("cpn"), used: item.used ?? 0 };
          const coupons = item.id
            ? current.coupons.map((row) => (row.id === item.id ? { ...row, ...next } : row))
            : [...current.coupons, next];
          return {
            ...current,
            coupons,
            auditLogs: [log(actor, item.id ? "updated" : "created", "coupon", next.id, next.code), ...current.auditLogs],
          };
        });
      },
      saveSection: (item) => {
        assertCapability(role, "catalogue.edit");
        demoStore.set((current) => ({
          ...current,
          homepageSections: current.homepageSections.map((row) => (row.id === item.id ? item : row)),
          auditLogs: [log(actor, "updated", "homepage_section", item.id, item.title), ...current.auditLogs],
        }));
      },
      saveReview: (item) => {
        assertCapability(role, "catalogue.edit");
        demoStore.set((current) => ({
          ...current,
          reviews: current.reviews.map((row) => (row.id === item.id ? item : row)),
        }));
      },
      saveSettings: (settings) => {
        assertCapability(role, "catalogue.edit");
        demoStore.set((current) => ({
          ...current,
          settings,
          auditLogs: [log(actor, "updated", "settings", "site", "Site settings"), ...current.auditLogs],
        }));
      },
      addOrder: (order) => {
        demoStore.set((current) => ({ ...current, orders: [order, ...current.orders] }));
      },
    };
  }, [state]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo must be used within DemoProvider");
  return value;
}

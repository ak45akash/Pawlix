"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { createBrowserStore } from "@/lib/browser-store";
import type { CartItem } from "@/types/catalog";

const cartStore = createBrowserStore<CartItem[]>("pawlix-cart-v1", []);

type CartContextValue = {
  items: CartItem[];
  add: (item: CartItem) => void;
  setQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  remove: (productId: string, variantId: string | null) => void;
  clear: () => void;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function sameLine(a: CartItem, b: Pick<CartItem, "productId" | "variantId">) {
  return a.productId === b.productId && a.variantId === b.variantId;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      add: (item) => {
        cartStore.set((current) => {
          const existing = current.find((row) => sameLine(row, item));
          if (existing) {
            return current.map((row) =>
              sameLine(row, item) ? { ...row, quantity: row.quantity + item.quantity } : row,
            );
          }
          return [...current, item];
        });
      },
      setQuantity: (productId, variantId, quantity) => {
        cartStore.set((current) =>
          quantity <= 0
            ? current.filter((row) => !sameLine(row, { productId, variantId }))
            : current.map((row) => (sameLine(row, { productId, variantId }) ? { ...row, quantity } : row)),
        );
      },
      remove: (productId, variantId) => {
        cartStore.set((current) => current.filter((row) => !sameLine(row, { productId, variantId })));
      },
      clear: () => cartStore.clear(),
      count: items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}

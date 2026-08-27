"use client";

import { storefrontProducts } from "@/lib/catalog";
import { useDemo } from "@/lib/demo-store";
import { ProductCard } from "@/components/store/product-card";
import type { Product } from "@/types/catalog";

export function ProductGrid({ products }: { products?: Product[] }) {
  const { state } = useDemo();
  const list = products ?? storefrontProducts(state);

  if (!list.length) {
    return <p className="py-16 text-center text-ink-muted">No products in this collection yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {list.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

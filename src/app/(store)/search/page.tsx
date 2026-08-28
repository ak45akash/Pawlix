"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ProductGrid } from "@/components/store/product-grid";
import { storefrontProducts } from "@/lib/catalog";
import { useDemo } from "@/lib/demo-store";

function SearchResults() {
  const query = useSearchParams().get("q") ?? "";
  const { state } = useDemo();
  const products = storefrontProducts(state).filter((product) => {
    const haystack = `${product.name} ${product.shortDescription} ${product.sku}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <main className="store-shell py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
      <p className="mt-2 text-sm text-ink-muted">
        {query ? `Results for “${query}”` : "Enter a search from the header."}
      </p>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}

"use client";

import { useParams } from "next/navigation";
import { ProductGrid } from "@/components/store/product-grid";
import { storefrontProducts } from "@/lib/catalog";
import { useDemo } from "@/lib/demo-store";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { state } = useDemo();
  const category = state.categories.find((item) => item.slug === slug);
  const products = category
    ? storefrontProducts(state).filter((product) => product.categoryId === category.id)
    : [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">{category?.name ?? "Category"}</h1>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </main>
  );
}

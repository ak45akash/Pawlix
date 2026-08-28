"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/store/product-grid";
import { FilterChip } from "@/components/store/filter-chip";
import { Select } from "@/components/ui/field";
import { storefrontProducts } from "@/lib/catalog";
import { useDemo } from "@/lib/demo-store";

function ShopView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state } = useDemo();
  const petSlug = searchParams.get("pet") ?? "";
  const categorySlug = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "featured";

  const pet = state.petTypes.find((item) => item.slug === petSlug && !item.archived);
  const category = state.categories.find((item) => item.slug === categorySlug && !item.archived);
  const categories = state.categories.filter((item) => {
    if (item.archived) return false;
    if (!pet) return true;
    return item.petTypeIds.includes(pet.id);
  });

  let products = storefrontProducts(state);
  if (pet) products = products.filter((product) => product.petTypeId === pet.id);
  if (category) products = products.filter((product) => product.categoryId === category.id);
  if (sort === "price-asc") products = [...products].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") products = [...products].sort((a, b) => b.price - a.price);
  if (sort === "name") products = [...products].sort((a, b) => a.name.localeCompare(b.name));

  function setFilter(next: { pet?: string; category?: string; sort?: string }) {
    const params = new URLSearchParams();
    const petNext = next.pet ?? petSlug;
    const categoryNext = next.category ?? categorySlug;
    const sortNext = next.sort ?? sort;
    if (petNext) params.set("pet", petNext);
    if (categoryNext) params.set("category", categoryNext);
    if (sortNext && sortNext !== "featured") params.set("sort", sortNext);
    const query = params.toString();
    router.replace(query ? `/shop?${query}` : "/shop");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 lg:px-6 lg:py-14">
      <p className="text-sm tracking-[0.2em] text-accent uppercase">Catalogue</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl md:text-5xl">Shop</h1>
          <p className="mt-2 max-w-xl text-ink-muted">
            One shelf for dogs, cats and birds. Filter by pet or category — no extra pages.
          </p>
        </div>
        <Select
          className="w-44"
          value={sort}
          onChange={(event) => setFilter({ sort: event.target.value })}
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name</option>
        </Select>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={!pet} onClick={() => setFilter({ pet: "", category: categorySlug })}>
            All pets
          </FilterChip>
          {state.petTypes
            .filter((item) => !item.archived)
            .map((item) => (
              <FilterChip
                key={item.id}
                active={pet?.id === item.id}
                onClick={() => setFilter({ pet: item.slug, category: "" })}
              >
                {item.name}
              </FilterChip>
            ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={!category} onClick={() => setFilter({ category: "" })}>
            All categories
          </FilterChip>
          {categories.map((item) => (
            <FilterChip
              key={item.id}
              active={category?.id === item.id}
              onClick={() => setFilter({ category: item.slug })}
            >
              {item.name}
            </FilterChip>
          ))}
        </div>
      </div>

      <p className="mt-8 text-sm text-ink-muted">{products.length} products</p>
      <div className="mt-6">
        <ProductGrid products={products} />
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopView />
    </Suspense>
  );
}

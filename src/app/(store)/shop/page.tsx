"use client";

import { Suspense, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/store/product-grid";
import { Select } from "@/components/ui/field";
import { categoriesForPet, storefrontProducts } from "@/lib/catalog";
import { useDemo } from "@/lib/demo-store";

function ShopView() {
  const params = useParams<{ petType?: string; category?: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state } = useDemo();
  const sort = searchParams.get("sort") ?? "featured";

  const pet = state.petTypes.find((item) => item.slug === params.petType);
  const category = state.categories.find(
    (item) => item.slug === params.category && (!pet || item.petTypeId === pet.id),
  );

  const products = useMemo(() => {
    let list = storefrontProducts(state);
    if (pet) list = list.filter((product) => product.petTypeId === pet.id);
    if (category) list = list.filter((product) => product.categoryId === category.id);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [state, pet, category, sort]);

  const title = category ? `${pet?.name ?? ""} ${category.name}` : pet ? pet.name : "Shop";
  const cats = pet ? categoriesForPet(state, pet.id) : [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-ink-muted">Catalogue</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-ink-muted">{products.length} products</p>
        </div>
        <Select
          className="w-44"
          value={sort}
          onChange={(event) => {
            const next = new URLSearchParams(searchParams.toString());
            next.set("sort", event.target.value);
            router.replace(`?${next.toString()}`);
          }}
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name</option>
        </Select>
      </div>
      {pet && cats.length ? (
        <div className="mb-8 flex flex-wrap gap-2">
          <a
            href={`/shop/${pet.slug}`}
            className={`rounded-md px-3 py-1.5 text-sm ${!category ? "bg-ink text-white" : "bg-canvas text-ink-muted"}`}
          >
            All
          </a>
          {cats.map((item) => (
            <a
              key={item.id}
              href={`/shop/${pet.slug}/${item.slug}`}
              className={`rounded-md px-3 py-1.5 text-sm ${category?.id === item.id ? "bg-ink text-white" : "bg-canvas text-ink-muted"}`}
            >
              {item.name}
            </a>
          ))}
        </div>
      ) : null}
      <ProductGrid products={products} />
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

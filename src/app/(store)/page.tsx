"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/store/product-grid";
import { Button } from "@/components/ui/button";
import { storefrontProducts } from "@/lib/catalog";
import { useDemo } from "@/lib/demo-store";

export default function HomePage() {
  const { state } = useDemo();
  const featured = storefrontProducts(state).filter((product) => product.featured);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:px-6 lg:py-24">
          <div>
            <p className="text-sm tracking-[0.2em] text-accent uppercase">Pawlix.com</p>
            <h1 className="mt-4 max-w-xl text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
              Care that feels considered.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-muted">
              Food, toys and everyday pieces for dogs, cats and birds — chosen for quality, not noise.
            </p>
            <div className="mt-8 flex gap-3">
              <Link href="/shop">
                <Button>Shop the catalogue</Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary">Our approach</Button>
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg md:aspect-[5/4]">
            <Image
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1600&q=80"
              alt="Dog resting indoors"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3 lg:px-6">
          {[
            ["Free shipping", "On orders above ₹1,499"],
            ["Thoughtful stock", "Short lists, not endless aisles"],
            ["Easy returns", "7-day returns on unused items"],
          ].map(([title, body]) => (
            <div key={title}>
              <p className="font-medium">{title}</p>
              <p className="mt-1 text-sm text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Featured</h2>
            <p className="mt-1 text-sm text-ink-muted">A short edit of what we keep in stock.</p>
          </div>
          <Link href="/shop" className="hidden items-center gap-1 text-sm text-accent sm:flex">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">Shop by pet</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {state.petTypes
              .filter((pet) => !pet.archived)
              .map((pet) => (
                <Link
                  key={pet.id}
                  href={`/shop/${pet.slug}`}
                  className="rounded-lg border border-border p-6 transition-colors hover:border-accent"
                >
                  <p className="text-lg font-medium">{pet.name}</p>
                  <p className="mt-1 text-sm text-ink-muted">Food, toys and accessories</p>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}

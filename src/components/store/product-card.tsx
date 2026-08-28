"use client";

import Link from "next/link";
import { availableStock, categoryById, displayMrp, petTypeById, sellingPrice } from "@/lib/catalog";
import { formatInr } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";
import type { Product } from "@/types/catalog";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";

export function ProductCard({ product }: { product: Product }) {
  const { state } = useDemo();
  const stock = availableStock(state, product);
  const price = sellingPrice(state, product);
  const mrp = displayMrp(state, product);
  const pet = petTypeById(state, product.petTypeId);
  const category = categoryById(state, product.categoryId);

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-canvas">
        <div className="relative aspect-[4/5]">
          <SmartImage
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
        {stock <= 0 ? (
          <span className="absolute top-3 left-3">
            <Badge tone="danger">Out of stock</Badge>
          </span>
        ) : null}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-[11px] tracking-[0.16em] text-ink-muted uppercase">
          {pet?.name} · {category?.name}
        </p>
        <h3 className="text-sm font-medium leading-snug">{product.name}</h3>
        <p className="text-sm text-ink-muted">
          {formatInr(price)}
          {mrp > price ? <span className="ml-2 text-xs line-through">{formatInr(mrp)}</span> : null}
        </p>
      </div>
    </Link>
  );
}

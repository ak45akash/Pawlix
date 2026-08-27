"use client";

import Image from "next/image";
import Link from "next/link";
import { availableStock, displayMrp, sellingPrice } from "@/lib/catalog";
import { formatInr } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";
import type { Product } from "@/types/catalog";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  const { state } = useDemo();
  const stock = availableStock(state, product);
  const price = sellingPrice(state, product);
  const mrp = displayMrp(state, product);

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg bg-canvas">
        <div className="relative aspect-[4/5]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium">{product.name}</h3>
          {stock <= 0 ? <Badge tone="danger">Out of stock</Badge> : null}
        </div>
        <p className="text-sm text-ink-muted">
          {formatInr(price)}
          {mrp > price ? <span className="ml-2 text-xs line-through">{formatInr(mrp)}</span> : null}
        </p>
      </div>
    </Link>
  );
}

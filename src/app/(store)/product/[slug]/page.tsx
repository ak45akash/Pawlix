"use client";

import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  availableStock,
  categoryById,
  displayMrp,
  findProduct,
  petTypeById,
  productVariants,
  sellingPrice,
} from "@/lib/catalog";
import { formatInr } from "@/lib/format";
import { useCart } from "@/lib/cart-store";
import { useDemo } from "@/lib/demo-store";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { state } = useDemo();
  const { add } = useCart();
  const product = findProduct(state, slug);
  const variants = product ? productVariants(state, product.id) : [];
  const [variantId, setVariantId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [image, setImage] = useState(0);
  const selectedVariantId = variantId ?? variants[0]?.id ?? null;
  const variant = variants.find((item) => item.id === selectedVariantId) ?? null;

  if (!product || product.archived || !product.published) {
    notFound();
  }

  const stock = availableStock(state, product, variant?.id);
  const price = sellingPrice(state, product, variant);
  const mrp = displayMrp(state, product, variant);
  const pet = petTypeById(state, product.petTypeId);
  const category = categoryById(state, product.categoryId);
  const images = product.images.length ? product.images : [product.image];

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-2 lg:px-6">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-lg bg-canvas">
          <Image src={images[image]} alt={product.name} fill className="object-cover" sizes="50vw" />
        </div>
        {images.length > 1 ? (
          <div className="mt-3 flex gap-2">
            {images.map((src, index) => (
              <button
                key={src}
                onClick={() => setImage(index)}
                className={`relative size-16 overflow-hidden rounded-md border ${image === index ? "border-accent" : "border-border"}`}
              >
                <Image src={src} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div>
        <p className="text-sm text-ink-muted">
          {pet?.name} · {category?.name}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{product.name}</h1>
        <p className="mt-3 text-xl">
          {formatInr(price)}
          {mrp > price ? <span className="ml-2 text-base text-ink-muted line-through">{formatInr(mrp)}</span> : null}
        </p>
        <p className="mt-4 leading-relaxed text-ink-muted">{product.shortDescription}</p>
        {variants.length ? (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">Size</p>
            <div className="flex flex-wrap gap-2">
              {variants.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setVariantId(item.id)}
                  className={`rounded-md border px-3 py-2 text-sm ${selectedVariantId === item.id ? "border-ink bg-ink text-white" : "border-border"}`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-11 items-center rounded-md border border-border">
            <button className="px-3" onClick={() => setQty((value) => Math.max(1, value - 1))}>
              −
            </button>
            <span className="w-8 text-center text-sm">{qty}</span>
            <button className="px-3" onClick={() => setQty((value) => value + 1)}>
              +
            </button>
          </div>
          <Button
            disabled={stock <= 0}
            onClick={() => {
              add({ productId: product.id, variantId: variant?.id ?? null, quantity: qty });
              setAdded(true);
            }}
          >
            {stock <= 0 ? "Out of stock" : "Add to cart"}
          </Button>
        </div>
        <div className="mt-3 flex gap-2 text-sm">
          {stock <= 0 ? <Badge tone="danger">Out of stock</Badge> : <Badge tone="success">{stock} in stock</Badge>}
          <span className="text-ink-muted">SKU {variant?.sku ?? product.sku}</span>
        </div>
        {added ? <p className="mt-3 text-sm text-success">Added to cart.</p> : null}
        <p className="mt-8 leading-relaxed text-ink-muted">{product.description}</p>
      </div>
    </main>
  );
}

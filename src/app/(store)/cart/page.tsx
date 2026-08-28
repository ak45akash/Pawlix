"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { availableStock, findProduct, productVariants, sellingPrice } from "@/lib/catalog";
import { formatInr } from "@/lib/format";
import { useCart } from "@/lib/cart-store";
import { useDemo } from "@/lib/demo-store";

export default function CartPage() {
  const { state } = useDemo();
  const { items, setQuantity, remove } = useCart();

  const lines = useMemo(
    () =>
      items
        .map((item) => {
          const product = findProduct(state, item.productId);
          if (!product) return null;
          const variant = productVariants(state, product.id).find((row) => row.id === item.variantId) ?? null;
          return {
            item,
            product,
            variant,
            price: sellingPrice(state, product, variant),
            stock: availableStock(state, product, variant?.id),
          };
        })
        .filter((row) => row !== null),
    [items, state],
  );

  const subtotal = lines.reduce((sum, line) => sum + line.price * line.item.quantity, 0);
  const shipping = subtotal >= state.settings.freeShippingThreshold || subtotal === 0 ? 0 : state.settings.shippingCharge;

  return (
    <main className="store-shell py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Cart</h1>
      {!lines.length ? (
        <div className="py-16 text-center">
          <p className="text-ink-muted">Your cart is empty.</p>
          <Link href="/shop" className="mt-4 inline-block">
            <Button>Continue shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {lines.map((line) => (
              <div key={`${line.product.id}-${line.variant?.id}`} className="flex gap-4 border-b border-border pb-6">
                <div className="relative size-24 overflow-hidden rounded-md bg-canvas">
                  <Image src={line.product.image} alt="" fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <Link href={`/product/${line.product.slug}`} className="font-medium">
                    {line.product.name}
                  </Link>
                  {line.variant ? <p className="text-sm text-ink-muted">{line.variant.name}</p> : null}
                  <p className="mt-1 text-sm">{formatInr(line.price)}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-9 items-center rounded-md border border-border text-sm">
                      <button className="px-2" onClick={() => setQuantity(line.product.id, line.variant?.id ?? null, line.item.quantity - 1)}>
                        −
                      </button>
                      <span className="w-6 text-center">{line.item.quantity}</span>
                      <button className="px-2" onClick={() => setQuantity(line.product.id, line.variant?.id ?? null, line.item.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <button className="text-sm text-ink-muted" onClick={() => remove(line.product.id, line.variant?.id ?? null)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-lg border border-border bg-surface p-5">
            <p className="font-medium">Summary</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-muted">Subtotal</span>
                <span>{formatInr(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Shipping</span>
                <span>{shipping ? formatInr(shipping) : "Free"}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 font-medium">
                <span>Total</span>
                <span>{formatInr(subtotal + shipping)}</span>
              </div>
            </div>
            <Link href="/checkout" className="mt-5 block">
              <Button className="w-full">Checkout</Button>
            </Link>
            <p className="mt-3 text-xs text-ink-muted">{state.settings.deliveryNote}</p>
          </aside>
        </div>
      )}
    </main>
  );
}

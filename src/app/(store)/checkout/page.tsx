"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { findProduct, productVariants, sellingPrice } from "@/lib/catalog";
import { formatInr } from "@/lib/format";
import { createId } from "@/lib/slug";
import { useCart } from "@/lib/cart-store";
import { useCustomer } from "@/lib/customer-store";
import { useDemo } from "@/lib/demo-store";

export default function CheckoutPage() {
  const router = useRouter();
  const { state, addOrder } = useDemo();
  const { items, clear } = useCart();
  const { customer, login } = useCustomer();
  const [error, setError] = useState("");

  const lines = useMemo(
    () =>
      items
        .map((item) => {
          const product = findProduct(state, item.productId);
          if (!product) return null;
          const variant = productVariants(state, product.id).find((row) => row.id === item.variantId) ?? null;
          return { item, product, variant, price: sellingPrice(state, product, variant) };
        })
        .filter((row) => row !== null),
    [items, state],
  );

  const subtotal = lines.reduce((sum, line) => sum + line.price * line.item.quantity, 0);
  const shipping = subtotal >= state.settings.freeShippingThreshold ? 0 : state.settings.shippingCharge;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping;

  function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lines.length) {
      setError("Your cart is empty.");
      return;
    }
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name"));
    const email = String(data.get("email"));
    login({ name, email });
    const orderId = createId("ord");
    addOrder({
      id: orderId,
      number: `PWL-${String(1000 + state.orders.length + 1)}`,
      customerName: name,
      customerEmail: email,
      status: "Pending payment",
      paymentStatus: "Pending",
      channel: "online",
      items: lines.map((line) => ({
        productId: line.product.id,
        variantId: line.variant?.id ?? null,
        name: line.variant ? `${line.product.name} · ${line.variant.name}` : line.product.name,
        sku: line.variant?.sku ?? line.product.sku,
        quantity: line.item.quantity,
        unitPrice: line.price,
      })),
      subtotal,
      discount: 0,
      shipping,
      tax,
      total,
      address: `${data.get("line1")}, ${data.get("city")} ${data.get("pincode")}`,
      createdAt: new Date().toISOString(),
    });
    clear();
    router.push(`/order-success?id=${orderId}`);
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-2 lg:px-6">
      <form className="space-y-4" onSubmit={placeOrder}>
        <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
        <p className="text-sm text-ink-muted">Payments will connect to Razorpay later. This places a demo order.</p>
        <Field label="Full name">
          <Input name="name" required defaultValue={customer?.name ?? ""} />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" required defaultValue={customer?.email ?? ""} />
        </Field>
        <Field label="Phone">
          <Input name="phone" required />
        </Field>
        <Field label="Address">
          <Textarea name="line1" required />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="City">
            <Input name="city" required />
          </Field>
          <Field label="Pincode">
            <Input name="pincode" required />
          </Field>
        </div>
        <Field label="State">
          <Select name="state" defaultValue="MH">
            <option value="MH">Maharashtra</option>
            <option value="KA">Karnataka</option>
            <option value="DL">Delhi</option>
            <option value="TN">Tamil Nadu</option>
          </Select>
        </Field>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" className="w-full">
          Place order · {formatInr(total)}
        </Button>
      </form>
      <aside className="h-fit rounded-lg border border-border bg-surface p-5">
        {lines.map((line) => (
          <div key={`${line.product.id}-${line.variant?.id}`} className="flex justify-between py-2 text-sm">
            <span>
              {line.product.name} {line.variant ? `· ${line.variant.name}` : ""} × {line.item.quantity}
            </span>
            <span>{formatInr(line.price * line.item.quantity)}</span>
          </div>
        ))}
        <div className="mt-4 flex justify-between border-t border-border pt-3 text-sm">
          <span>Shipping</span>
          <span>{shipping ? formatInr(shipping) : "Free"}</span>
        </div>
        <div className="mt-2 flex justify-between font-medium">
          <span>Total</span>
          <span>{formatInr(total)}</span>
        </div>
      </aside>
    </main>
  );
}

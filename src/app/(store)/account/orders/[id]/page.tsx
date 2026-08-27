"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { formatDate, formatInr } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useDemo();
  const order = state.orders.find((item) => item.id === id);

  if (!order) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <p>Order not found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 lg:px-6">
      <Link href="/account" className="text-sm text-ink-muted">
        ← Account
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{order.number}</h1>
      <p className="mt-1 text-sm text-ink-muted">
        {formatDate(order.createdAt)} · {order.status} · {order.paymentStatus}
      </p>
      <div className="mt-8 divide-y divide-border border-y border-border">
        {order.items.map((item) => (
          <div key={`${item.sku}-${item.quantity}`} className="flex justify-between py-4 text-sm">
            <span>
              {item.name}
              <span className="block text-ink-muted">
                {item.sku} × {item.quantity}
              </span>
            </span>
            <span>{formatInr(item.unitPrice * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{order.shipping ? formatInr(order.shipping) : "Free"}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{formatInr(order.total)}</span>
        </div>
      </div>
      <p className="mt-6 text-sm text-ink-muted">{order.address}</p>
    </main>
  );
}

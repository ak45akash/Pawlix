"use client";

import { formatInr } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";

export default function ReportsPage() {
  const { state } = useDemo();
  const online = state.orders.filter((order) => order.channel === "online");
  const offline = state.orders.filter((order) => order.channel === "offline");
  const net = state.orders.reduce((sum, order) => sum + order.total - order.shipping, 0);
  const discounts = state.orders.reduce((sum, order) => sum + order.discount, 0);
  const cogs = state.orders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce((itemSum, item) => {
        const product = state.products.find((row) => row.id === item.productId);
        return itemSum + (product?.cost ?? 0) * item.quantity;
      }, 0),
    0,
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
      <p className="mt-1 text-sm text-ink-muted">Estimated figures from demo orders. Not net profit.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Online sales", formatInr(online.reduce((sum, order) => sum + order.total, 0))],
          ["Offline sales", formatInr(offline.reduce((sum, order) => sum + order.total, 0))],
          ["Combined", formatInr(state.orders.reduce((sum, order) => sum + order.total, 0))],
          ["Discounts given", formatInr(discounts)],
          ["Estimated COGS", formatInr(cogs)],
          ["Estimated gross profit", formatInr(net - cogs)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-sm text-ink-muted">{label}</p>
            <p className="mt-2 text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { availableStock, stockStatus, storefrontProducts } from "@/lib/catalog";
import { formatInr } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const { state } = useDemo();
  const today = new Date().toISOString().slice(0, 10);
  const todaysOrders = state.orders.filter((order) => order.createdAt.startsWith(today));
  const revenue = state.orders.reduce((sum, order) => sum + order.total, 0);
  const online = state.orders.filter((order) => order.channel === "online").reduce((sum, order) => sum + order.total, 0);
  const offline = state.orders.filter((order) => order.channel === "offline").reduce((sum, order) => sum + order.total, 0);
  const low = state.products.filter((product) => {
    const qty = availableStock(state, product);
    return stockStatus(qty, product.lowStockThreshold) !== "ok";
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-muted">Demo figures from local data. Analytics stay local until Supabase.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Today's orders", String(todaysOrders.length)],
          ["Total revenue", formatInr(revenue)],
          ["Online", formatInr(online)],
          ["Offline", formatInr(offline)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-sm text-ink-muted">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-accent">
              View all
            </Link>
          </div>
          <div className="mt-3 divide-y divide-border">
            {state.orders.slice(0, 5).map((order) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex justify-between py-3 text-sm">
                <span>
                  {order.number}
                  <span className="block text-ink-muted">{order.customerName}</span>
                </span>
                <span className="text-right">
                  {formatInr(order.total)}
                  <span className="block text-ink-muted">{order.status}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Stock alerts</h2>
            <Link href="/admin/inventory" className="text-sm text-accent">
              Inventory
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {low.map((product) => {
              const qty = availableStock(state, product);
              return (
                <div key={product.id} className="flex items-center justify-between text-sm">
                  <span>{product.name}</span>
                  <Badge tone={qty <= 0 ? "danger" : "accent"}>{qty <= 0 ? "Out" : `${qty} left`}</Badge>
                </div>
              );
            })}
            {!low.length ? <p className="text-sm text-ink-muted">No low-stock products.</p> : null}
          </div>
          <p className="mt-4 text-xs text-ink-muted">{storefrontProducts(state).length} published on the storefront.</p>
        </section>
      </div>
    </div>
  );
}

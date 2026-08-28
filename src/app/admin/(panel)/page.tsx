"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  IndianRupee,
  PackageX,
  ShoppingBag,
  TrendingUp,
  Truck,
} from "lucide-react";
import {
  ChannelDonutChart,
  ChartCard,
  RevenueTrendChart,
  StatCard,
  StatusBarsChart,
  TopProductsChart,
} from "@/components/admin/dashboard-charts";
import { Badge } from "@/components/ui/badge";
import { availableStock, stockStatus, storefrontProducts } from "@/lib/catalog";
import {
  channelBreakdown,
  computeKpis,
  filterOrdersByPeriod,
  filterPreviousPeriodOrders,
  percentChange,
  revenueByDay,
  statusBreakdown,
  topProducts,
  type DashboardPeriod,
} from "@/lib/dashboard-metrics";
import { formatDate, formatInr } from "@/lib/format";
import { cmpDate } from "@/lib/admin-table-sort";
import { useDemo } from "@/lib/demo-store";
import { cn } from "@/lib/utils/cn";

const periods: { id: DashboardPeriod; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
];

function statusTone(status: string): "neutral" | "success" | "danger" | "accent" {
  if (status === "Delivered") return "success";
  if (status === "Cancelled" || status === "Refunded") return "danger";
  if (status === "Shipped" || status === "Out for delivery") return "accent";
  return "neutral";
}

export default function AdminDashboardPage() {
  const { state } = useDemo();
  const [period, setPeriod] = useState<DashboardPeriod>("7d");

  const periodOrders = useMemo(() => filterOrdersByPeriod(state.orders, period), [state.orders, period]);
  const previousOrders = useMemo(() => filterPreviousPeriodOrders(state.orders, period), [state.orders, period]);
  const kpis = useMemo(() => computeKpis(periodOrders, state), [periodOrders, state]);
  const previousKpis = useMemo(() => computeKpis(previousOrders, state), [previousOrders, state]);
  const trend = useMemo(() => revenueByDay(state.orders, 7), [state.orders]);
  const channels = useMemo(() => channelBreakdown(periodOrders), [periodOrders]);
  const products = useMemo(() => topProducts(periodOrders, state), [periodOrders, state]);
  const statuses = useMemo(() => statusBreakdown(periodOrders), [periodOrders]);
  const recentOrders = useMemo(
    () => [...state.orders].sort((a, b) => cmpDate(b.createdAt, a.createdAt)).slice(0, 6),
    [state.orders],
  );

  const low = state.products.filter((product) => {
    const qty = availableStock(state, product);
    return stockStatus(qty, product.lowStockThreshold) !== "ok";
  });

  const periodLabel = periods.find((row) => row.id === period)?.label.toLowerCase() ?? period;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-accent">Overview</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            Sales, inventory, and fulfilment at a glance. Figures are from local demo data until Supabase is connected.
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-border bg-surface p-1 shadow-sm">
          {periods.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => setPeriod(row.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                period === row.id ? "bg-inverse text-on-inverse" : "text-ink-muted hover:text-ink",
              )}
            >
              {row.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          label="Orders"
          value={String(kpis.orderCount)}
          hint={`In the last ${periodLabel}`}
          trend={percentChange(kpis.orderCount, previousKpis.orderCount)}
          icon={ShoppingBag}
        />
        <StatCard
          label="Revenue"
          value={formatInr(kpis.revenue)}
          hint={`Net sales ${formatInr(kpis.netSales)}`}
          trend={percentChange(kpis.revenue, previousKpis.revenue)}
          icon={IndianRupee}
        />
        <StatCard
          label="Avg. order value"
          value={formatInr(kpis.avgOrderValue)}
          hint={`${formatInr(kpis.discounts)} discounts`}
          trend={percentChange(kpis.avgOrderValue, previousKpis.avgOrderValue)}
          icon={TrendingUp}
        />
        <StatCard
          label="Est. gross profit"
          value={formatInr(kpis.estimatedGrossProfit)}
          hint={`COGS ${formatInr(kpis.estimatedCogs)}`}
          trend={percentChange(kpis.estimatedGrossProfit, previousKpis.estimatedGrossProfit)}
          icon={TrendingUp}
          tone="success"
        />
        <StatCard
          label="Low stock"
          value={String(kpis.lowStockCount)}
          hint={`${kpis.outOfStockCount} out of stock`}
          icon={AlertTriangle}
          tone={kpis.lowStockCount + kpis.outOfStockCount > 0 ? "danger" : "success"}
        />
        <StatCard
          label="Shipping & tax"
          value={formatInr(kpis.shipping + kpis.taxes)}
          hint={`${formatInr(kpis.shipping)} shipping · ${formatInr(kpis.taxes)} tax`}
          icon={Truck}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <ChartCard title="Revenue trend" subtitle="Last 7 days · all channels" className="xl:col-span-2">
          <RevenueTrendChart data={trend} />
        </ChartCard>
        <ChartCard title="Sales by channel" subtitle={`Split for ${periodLabel}`}>
          <ChannelDonutChart slices={channels} />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Top products" subtitle={`By revenue · ${periodLabel}`}>
          <TopProductsChart items={products} />
        </ChartCard>
        <ChartCard title="Order status" subtitle={`Fulfilment pipeline · ${periodLabel}`}>
          <StatusBarsChart slices={statuses} />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-xl border border-border bg-surface shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-medium tracking-tight">Recent orders</h2>
              <p className="mt-0.5 text-xs text-ink-muted">Latest activity across online and offline</p>
            </div>
            <Link href="/admin/orders" className="text-sm font-medium text-accent hover:text-accent-hover">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Channel</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-canvas/60">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-medium hover:text-accent">
                        {order.number}
                      </Link>
                      <p className="text-xs text-ink-muted">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-5 py-3">{order.customerName}</td>
                    <td className="px-5 py-3 capitalize">{order.channel}</td>
                    <td className="px-5 py-3 tabular-nums">{formatInr(order.total)}</td>
                    <td className="px-5 py-3">
                      <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-medium tracking-tight">Inventory alerts</h2>
              <p className="mt-0.5 text-xs text-ink-muted">{storefrontProducts(state).length} products live on storefront</p>
            </div>
            <Link href="/admin/inventory" className="text-sm font-medium text-accent hover:text-accent-hover">
              Manage
            </Link>
          </div>
          <div className="divide-y divide-border px-5">
            {low.slice(0, 6).map((product) => {
              const qty = availableStock(state, product);
              return (
                <div key={product.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{product.name}</p>
                    <p className="text-xs text-ink-muted">{product.sku}</p>
                  </div>
                  <Badge tone={qty <= 0 ? "danger" : "accent"}>{qty <= 0 ? "Out of stock" : `${qty} left`}</Badge>
                </div>
              );
            })}
            {!low.length ? (
              <p className="py-8 text-center text-sm text-ink-muted">All products are above their low-stock thresholds.</p>
            ) : null}
          </div>
          {kpis.outOfStockCount ? (
            <div className="flex items-center gap-2 border-t border-border bg-danger-soft/40 px-5 py-3 text-xs text-danger">
              <PackageX className="size-4 shrink-0" />
              {kpis.outOfStockCount} product{kpis.outOfStockCount === 1 ? "" : "s"} need restocking before the next campaign.
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

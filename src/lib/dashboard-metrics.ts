import type { DemoState, Order } from "@/types/catalog";
import { availableStock, stockStatus } from "@/lib/catalog";

export type DashboardPeriod = "today" | "7d" | "30d";

export type DayBucket = {
  key: string;
  label: string;
  revenue: number;
  orders: number;
};

export type ChannelSlice = {
  channel: "online" | "offline";
  label: string;
  value: number;
  orders: number;
};

export type ProductRank = {
  productId: string;
  name: string;
  revenue: number;
  units: number;
};

export type StatusSlice = {
  status: string;
  count: number;
};

export type DashboardKpis = {
  orderCount: number;
  revenue: number;
  netSales: number;
  discounts: number;
  shipping: number;
  taxes: number;
  estimatedCogs: number;
  estimatedGrossProfit: number;
  avgOrderValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  onlineRevenue: number;
  offlineRevenue: number;
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function orderDay(order: Order) {
  return order.createdAt.slice(0, 10);
}

export function periodDays(period: DashboardPeriod) {
  if (period === "today") return 1;
  if (period === "7d") return 7;
  return 30;
}

export function filterOrdersByPeriod(orders: Order[], period: DashboardPeriod, anchor = new Date()) {
  const end = startOfDay(anchor);
  const start = addDays(end, -(periodDays(period) - 1));
  return orders.filter((order) => {
    const day = startOfDay(new Date(order.createdAt));
    return day >= start && day <= end;
  });
}

export function filterPreviousPeriodOrders(orders: Order[], period: DashboardPeriod, anchor = new Date()) {
  const currentStart = addDays(startOfDay(anchor), -(periodDays(period) - 1));
  const previousEnd = addDays(currentStart, -1);
  const previousStart = addDays(previousEnd, -(periodDays(period) - 1));
  return orders.filter((order) => {
    const day = startOfDay(new Date(order.createdAt));
    return day >= previousStart && day <= previousEnd;
  });
}

export function percentChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function revenueByDay(orders: Order[], days: number, anchor = new Date()): DayBucket[] {
  const end = startOfDay(anchor);
  const start = addDays(end, -(days - 1));
  const buckets = new Map<string, DayBucket>();

  for (let i = 0; i < days; i += 1) {
    const day = addDays(start, i);
    const key = toDayKey(day);
    buckets.set(key, {
      key,
      label: day.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
      revenue: 0,
      orders: 0,
    });
  }

  for (const order of orders) {
    const key = orderDay(order);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    bucket.revenue += order.total;
    bucket.orders += 1;
  }

  return [...buckets.values()];
}

export function channelBreakdown(orders: Order[]): ChannelSlice[] {
  const online = orders.filter((order) => order.channel === "online");
  const offline = orders.filter((order) => order.channel === "offline");
  return [
    {
      channel: "online",
      label: "Online",
      value: online.reduce((sum, order) => sum + order.total, 0),
      orders: online.length,
    },
    {
      channel: "offline",
      label: "Offline",
      value: offline.reduce((sum, order) => sum + order.total, 0),
      orders: offline.length,
    },
  ];
}

export function statusBreakdown(orders: Order[]): StatusSlice[] {
  const counts = new Map<string, number>();
  for (const order of orders) {
    counts.set(order.status, (counts.get(order.status) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);
}

export function topProducts(orders: Order[], state: DemoState, limit = 5): ProductRank[] {
  const totals = new Map<string, ProductRank>();

  for (const order of orders) {
    for (const item of order.items) {
      const product = state.products.find((row) => row.id === item.productId);
      const existing = totals.get(item.productId) ?? {
        productId: item.productId,
        name: product?.name ?? item.name,
        revenue: 0,
        units: 0,
      };
      existing.revenue += item.unitPrice * item.quantity;
      existing.units += item.quantity;
      totals.set(item.productId, existing);
    }
  }

  return [...totals.values()].sort((a, b) => b.revenue - a.revenue).slice(0, limit);
}

export function estimateCogs(orders: Order[], state: DemoState) {
  return orders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce((itemSum, item) => {
        const product = state.products.find((row) => row.id === item.productId);
        const variant = item.variantId ? state.variants.find((row) => row.id === item.variantId) : null;
        const unitCost = variant?.cost ?? product?.cost ?? 0;
        return itemSum + unitCost * item.quantity;
      }, 0),
    0,
  );
}

export function computeKpis(orders: Order[], state: DemoState): DashboardKpis {
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const netSales = orders.reduce((sum, order) => sum + order.total - order.shipping, 0);
  const discounts = orders.reduce((sum, order) => sum + order.discount, 0);
  const shipping = orders.reduce((sum, order) => sum + order.shipping, 0);
  const taxes = orders.reduce((sum, order) => sum + order.tax, 0);
  const estimatedCogs = estimateCogs(orders, state);
  const onlineRevenue = orders.filter((order) => order.channel === "online").reduce((sum, order) => sum + order.total, 0);
  const offlineRevenue = orders.filter((order) => order.channel === "offline").reduce((sum, order) => sum + order.total, 0);

  let lowStockCount = 0;
  let outOfStockCount = 0;
  for (const product of state.products) {
    const qty = availableStock(state, product);
    const status = stockStatus(qty, product.lowStockThreshold);
    if (status === "out") outOfStockCount += 1;
    else if (status === "low") lowStockCount += 1;
  }

  return {
    orderCount: orders.length,
    revenue,
    netSales,
    discounts,
    shipping,
    taxes,
    estimatedCogs,
    estimatedGrossProfit: netSales - estimatedCogs,
    avgOrderValue: orders.length ? Math.round(revenue / orders.length) : 0,
    lowStockCount,
    outOfStockCount,
    onlineRevenue,
    offlineRevenue,
  };
}

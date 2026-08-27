"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Select } from "@/components/ui/field";
import { formatDate, formatInr } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";
import type { OrderStatus } from "@/types/catalog";

const statuses: OrderStatus[] = [
  "Pending payment",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for delivery",
  "Delivered",
  "Cancelled",
  "Return requested",
  "Returned",
  "Refunded",
];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { state, updateOrderStatus } = useDemo();
  const order = state.orders.find((item) => item.id === id);
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/orders" className="text-sm text-ink-muted">
        ← Orders
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{order.number}</h1>
          <p className="text-sm text-ink-muted">
            {order.customerName} · {formatDate(order.createdAt)} · {order.channel}
          </p>
        </div>
        <Select value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value as OrderStatus)}>
          {statuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </Select>
      </div>
      <div className="mt-6 divide-y divide-border border-y border-border">
        {order.items.map((item) => (
          <div key={item.sku} className="flex justify-between py-3 text-sm">
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
      <p className="mt-4 text-right font-medium">{formatInr(order.total)}</p>
      <p className="mt-4 text-sm text-ink-muted">{order.address}</p>
    </div>
  );
}

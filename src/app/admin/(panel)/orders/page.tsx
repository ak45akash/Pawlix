"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatInr } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";

export default function AdminOrdersPage() {
  const { state } = useDemo();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-ink-muted">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {state.orders.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium">
                    {order.number}
                  </Link>
                  <p className="text-xs text-ink-muted">{formatDate(order.createdAt)}</p>
                </td>
                <td className="px-4 py-3">{order.customerName}</td>
                <td className="px-4 py-3 capitalize">{order.channel}</td>
                <td className="px-4 py-3">{formatInr(order.total)}</td>
                <td className="px-4 py-3">
                  <Badge>{order.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

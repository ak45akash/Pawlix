"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TableSortSelect } from "@/components/admin/table-sort-select";
import { cmpDate, cmpNumber, cmpString, sortRows } from "@/lib/admin-table-sort";
import { formatDate, formatInr } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";

export default function AdminOrdersPage() {
  const { state } = useDemo();
  const [sort, setSort] = useState("date-desc");
  const sortOptions = [
    { value: "date-desc", label: "Newest first" },
    { value: "date-asc", label: "Oldest first" },
    { value: "total-desc", label: "Total (high to low)" },
    { value: "total-asc", label: "Total (low to high)" },
    { value: "customer-asc", label: "Customer (A–Z)" },
    { value: "status-asc", label: "Status (A–Z)" },
  ];
  const orders = useMemo(
    () =>
      sortRows(state.orders, sort, {
        "date-desc": (a, b) => cmpDate(b.createdAt, a.createdAt),
        "date-asc": (a, b) => cmpDate(a.createdAt, b.createdAt),
        "total-desc": (a, b) => cmpNumber(b.total, a.total),
        "total-asc": (a, b) => cmpNumber(a.total, b.total),
        "customer-asc": (a, b) => cmpString(a.customerName, b.customerName),
        "status-asc": (a, b) => cmpString(a.status, b.status),
      }),
    [state.orders, sort],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <TableSortSelect options={sortOptions} value={sort} onChange={setSort} />
      </div>
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
            {orders.map((order) => (
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

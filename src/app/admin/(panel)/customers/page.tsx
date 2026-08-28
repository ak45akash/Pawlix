"use client";

import { useMemo, useState } from "react";
import { TableSortSelect } from "@/components/admin/table-sort-select";
import { cmpDate, cmpNumber, cmpString, sortRows } from "@/lib/admin-table-sort";
import { formatDate, formatInr } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";

export default function CustomersPage() {
  const { state } = useDemo();
  const [sort, setSort] = useState("spent-desc");
  const sortOptions = [
    { value: "spent-desc", label: "Spent (high to low)" },
    { value: "spent-asc", label: "Spent (low to high)" },
    { value: "orders-desc", label: "Orders (most first)" },
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "since-desc", label: "Newest customers" },
    { value: "since-asc", label: "Oldest customers" },
  ];
  const customers = useMemo(
    () =>
      sortRows(state.customers, sort, {
        "spent-desc": (a, b) => cmpNumber(b.spent, a.spent),
        "spent-asc": (a, b) => cmpNumber(a.spent, b.spent),
        "orders-desc": (a, b) => cmpNumber(b.orders, a.orders),
        "name-asc": (a, b) => cmpString(a.name, b.name),
        "since-desc": (a, b) => cmpDate(b.createdAt, a.createdAt),
        "since-asc": (a, b) => cmpDate(a.createdAt, b.createdAt),
      }),
    [state.customers, sort],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <TableSortSelect options={sortOptions} value={sort} onChange={setSort} />
      </div>
      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-ink-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Spent</th>
              <th className="px-4 py-3">Since</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{customer.name}</td>
                <td className="px-4 py-3">{customer.email}</td>
                <td className="px-4 py-3">{customer.orders}</td>
                <td className="px-4 py-3">{formatInr(customer.spent)}</td>
                <td className="px-4 py-3">{formatDate(customer.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

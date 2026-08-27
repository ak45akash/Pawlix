"use client";

import { formatDate, formatInr } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";

export default function CustomersPage() {
  const { state } = useDemo();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
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
            {state.customers.map((customer) => (
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

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { formatDate, formatInr } from "@/lib/format";
import { useCustomer } from "@/lib/customer-store";
import { useDemo } from "@/lib/demo-store";

export default function AccountPage() {
  const { customer, login, logout } = useCustomer();
  const { state } = useDemo();
  const router = useRouter();
  const orders = customer ? state.orders.filter((order) => order.customerEmail === customer.email) : [];

  if (!customer) {
    return (
      <main className="store-shell py-16">
        <div className="max-w-md">
        <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
        <p className="mt-2 text-sm text-ink-muted">Demo login — no password required yet.</p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            login({ name: String(data.get("name")), email: String(data.get("email")) });
          }}
        >
          <Field label="Name">
            <Input name="name" required defaultValue="Ananya Shah" />
          </Field>
          <Field label="Email">
            <Input name="email" type="email" required defaultValue="ananya@example.com" />
          </Field>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <p className="mt-4 text-sm text-ink-muted">
          New here? <Link href="/register">Create an account</Link>
        </p>
        </div>
      </main>
    );
  }

  return (
    <main className="store-shell py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Hello, {customer.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-ink-muted">{customer.email}</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            logout();
            router.refresh();
          }}
        >
          Sign out
        </Button>
      </div>
      <h2 className="mt-10 text-lg font-medium">Orders</h2>
      <div className="mt-4 divide-y divide-border border-y border-border">
        {orders.length ? (
          orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`} className="flex justify-between py-4">
              <span>
                {order.number}
                <span className="block text-sm text-ink-muted">{formatDate(order.createdAt)}</span>
              </span>
              <span className="text-right">
                {formatInr(order.total)}
                <span className="block text-sm text-ink-muted">{order.status}</span>
              </span>
            </Link>
          ))
        ) : (
          <p className="py-8 text-sm text-ink-muted">No orders on this email yet.</p>
        )}
      </div>
    </main>
  );
}

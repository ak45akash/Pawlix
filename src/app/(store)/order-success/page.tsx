"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/demo-store";

function Success() {
  const id = useSearchParams().get("id");
  const { state } = useDemo();
  const order = state.orders.find((item) => item.id === id);

  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm tracking-[0.2em] text-accent uppercase">Thank you</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Order received</h1>
      <p className="mt-3 text-ink-muted">
        {order
          ? `Order ${order.number} is pending payment. Razorpay will be connected in a later phase.`
          : "Your demo order has been recorded."}
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/account/orders">
          <Button>View orders</Button>
        </Link>
        <Link href="/shop">
          <Button variant="secondary">Continue shopping</Button>
        </Link>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <Success />
    </Suspense>
  );
}

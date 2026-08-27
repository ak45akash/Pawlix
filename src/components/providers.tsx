"use client";

import { CartProvider } from "@/lib/cart-store";
import { CustomerProvider } from "@/lib/customer-store";
import { DemoProvider } from "@/lib/demo-store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <CartProvider>
        <CustomerProvider>{children}</CustomerProvider>
      </CartProvider>
    </DemoProvider>
  );
}

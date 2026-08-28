"use client";

import { CartProvider } from "@/lib/cart-store";
import { CustomerProvider } from "@/lib/customer-store";
import { DemoProvider } from "@/lib/demo-store";
import { ThemeProvider } from "@/lib/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DemoProvider>
        <CartProvider>
          <CustomerProvider>{children}</CustomerProvider>
        </CartProvider>
      </DemoProvider>
    </ThemeProvider>
  );
}

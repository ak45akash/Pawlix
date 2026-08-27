"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { createBrowserStore } from "@/lib/browser-store";

export type CustomerSession = {
  name: string;
  email: string;
};

const customerStore = createBrowserStore<CustomerSession | null>("pawlix-customer-v1", null);

type CustomerContextValue = {
  customer: CustomerSession | null;
  login: (customer: CustomerSession) => void;
  logout: () => void;
};

const CustomerContext = createContext<CustomerContextValue | null>(null);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const customer = useSyncExternalStore(
    customerStore.subscribe,
    customerStore.getSnapshot,
    customerStore.getServerSnapshot,
  );

  const value = useMemo<CustomerContextValue>(
    () => ({
      customer,
      login: (next) => customerStore.set(next),
      logout: () => customerStore.clear(),
    }),
    [customer],
  );

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
}

export function useCustomer() {
  const value = useContext(CustomerContext);
  if (!value) throw new Error("useCustomer must be used within CustomerProvider");
  return value;
}

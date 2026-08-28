import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: `Pawlix shipping across the Tricity — ${siteConfig.location.formatted}. Charges, free-shipping threshold, and local delivery times.`,
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <main className="store-shell py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Shipping Policy</h1>
      <p className="mt-6 leading-relaxed text-ink-muted">
        Standard shipping is ₹79. Orders above ₹1,499 ship free. For now we deliver across the Tricity —{" "}
        {siteConfig.location.cities.join(", ")}. Chandigarh, Mohali and Panchkula usually arrive in 1–2 days; nearby
        pincodes in 2–4 days. Courier APIs can be added later without changing checkout.
      </p>
    </main>
  );
}

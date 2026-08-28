import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for ordering on pawlix.com, including prices, stock and delivery.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Terms</h1>
      <p className="mt-6 leading-relaxed text-ink-muted">
        By placing an order on pawlix.com you agree that product descriptions, prices and stock are as shown at checkout.
        Title passes on delivery. These terms will be updated before production launch.
      </p>
    </main>
  );
}

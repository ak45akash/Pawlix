import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: "7-day returns on unused Pawlix items. How refunds are issued after inspection.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Returns & Refunds</h1>
      <p className="mt-6 leading-relaxed text-ink-muted">
        Unused, unopened items can be returned within 7 days. Food opened after delivery is not returnable unless there
        is a quality issue. Refunds are issued to the original payment method after inspection.
      </p>
    </main>
  );
}

import Link from "next/link";

export function LegalPage({
  title,
  description,
  lastUpdated,
  children,
}: {
  title: string;
  description: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <article>
      <header className="border-b border-border bg-surface">
        <div className="store-shell py-14 lg:py-16">
          <p className="text-sm tracking-[0.2em] text-accent uppercase">Legal</p>
          <h1 className="font-display mt-3 text-4xl md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-muted">{description}</p>
          <p className="mt-4 text-sm text-ink-muted">Last updated: {lastUpdated}</p>
        </div>
      </header>
      <div className="store-shell py-14 lg:py-16">
        <div className="mx-auto max-w-3xl space-y-10">{children}</div>
      </div>
    </article>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-10 first:border-0 first:pt-0">
      <h2 className="font-display text-2xl tracking-tight">{title}</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-ink-muted">{children}</div>
    </section>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function LegalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-accent hover:text-accent-hover">
      {children}
    </Link>
  );
}

export const LEGAL = {
  lastUpdated: "29 August 2026",
  email: "hello@pawlix.com",
  brand: "Pawlix",
  domain: "pawlix.com",
  returnWindowDays: 7,
  shippingCharge: 79,
  freeShippingThreshold: 1499,
} as const;

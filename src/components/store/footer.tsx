import Link from "next/link";
import { siteConfig } from "@/config/site";
import { shopHref } from "@/lib/content";

export function StoreFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div>
          <p className="font-display text-xl">{siteConfig.name}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">{siteConfig.description}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Shop</p>
          <div className="mt-3 grid gap-2 text-sm text-ink-muted">
            <Link href="/shop">All products</Link>
            <Link href={shopHref({ pet: "dog" })}>Dogs</Link>
            <Link href={shopHref({ pet: "cat" })}>Cats</Link>
            <Link href={shopHref({ pet: "bird" })}>Birds</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Read</p>
          <div className="mt-3 grid gap-2 text-sm text-ink-muted">
            <Link href="/blog">Blog</Link>
            <Link href="/recipes">Recipes</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Help</p>
          <div className="mt-3 grid gap-2 text-sm text-ink-muted">
            <Link href="/shipping">Shipping</Link>
            <Link href="/returns">Returns</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/admin/login">Admin</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} {siteConfig.name} · {siteConfig.domain}
      </div>
    </footer>
  );
}

import Link from "next/link";
import { siteConfig } from "@/config/site";

export function StoreFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div>
          <p className="font-semibold">{siteConfig.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{siteConfig.description}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Shop</p>
          <div className="mt-3 grid gap-2 text-sm text-ink-muted">
            <Link href="/shop/dog">Dogs</Link>
            <Link href="/shop/cat">Cats</Link>
            <Link href="/shop/bird">Birds</Link>
            <Link href="/shop">All products</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Help</p>
          <div className="mt-3 grid gap-2 text-sm text-ink-muted">
            <Link href="/contact">Contact</Link>
            <Link href="/shipping">Shipping</Link>
            <Link href="/returns">Returns</Link>
            <Link href="/account">Account</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Legal</p>
          <div className="mt-3 grid gap-2 text-sm text-ink-muted">
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

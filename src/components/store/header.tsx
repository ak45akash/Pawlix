"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useCart } from "@/lib/cart-store";
import { ThemeToggle } from "@/lib/theme";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/recipes", label: "Recipes" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function StoreHeader() {
  const { count } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  function search(event: FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  }

  function active(href: string) {
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3.5 lg:px-6">
        <button className="lg:hidden" aria-label="Menu" onClick={() => setOpen(true)}>
          <Menu className="size-5" />
        </button>
        <Link href="/" className="font-display text-xl tracking-tight">
          {siteConfig.name}
        </Link>
        <nav className="hidden items-center gap-7 text-sm lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-ink-muted transition-colors hover:text-ink",
                active(link.href) && "text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <form onSubmit={search} className="ml-auto hidden max-w-xs flex-1 lg:block">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              className="h-10 w-full rounded-full border border-border bg-canvas/80 pr-3 pl-9 text-sm outline-none focus:border-accent"
            />
          </div>
        </form>
        <Link href="/account" className="ml-auto text-ink-muted hover:text-ink lg:ml-2" aria-label="Account">
          <User className="size-5" />
        </Link>
        <ThemeToggle />
        <Link href="/cart" className="relative text-ink-muted hover:text-ink" aria-label="Cart">
          <ShoppingBag className="size-5" />
          {count ? (
            <span className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] text-white">
              {count}
            </span>
          ) : null}
        </Link>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 bg-inverse/50 lg:hidden">
          <div className="h-full w-80 bg-surface p-5">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-lg">{siteConfig.name}</span>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={search} className="mb-6">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
                className="h-10 w-full rounded-full border border-border px-4 text-sm"
              />
            </form>
            <div className="grid gap-4 text-sm">
              {links.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <Link href="/admin/login" className="text-ink-muted" onClick={() => setOpen(false)}>
                Admin
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Users,
  UtensilsCrossed,
  Warehouse,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { canDeleteCatalogue } from "@/lib/permissions/catalogue.ts";
import { useDemo } from "@/lib/demo-store";
import { ThemeToggle } from "@/lib/theme";
import { cn } from "@/lib/utils/cn";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/pet-types", label: "Pet types", icon: FolderTree },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/subcategories", label: "Subcategories", icon: FolderTree },
  { href: "/admin/brands", label: "Brands", icon: Tag },
  { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/content", label: "Homepage", icon: ClipboardList },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/recipes", label: "Recipes", icon: UtensilsCrossed },
  { href: "/admin/reviews", label: "Reviews", icon: ClipboardList },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/audit", label: "Audit log", icon: ClipboardList },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useDemo();
  const [open, setOpen] = useState(false);
  const isPostEditor = /^\/admin\/(blog|recipes)\/.+$/.test(pathname);

  function logout() {
    document.cookie = "pawlix_admin=; Path=/; Max-Age=0";
    router.push("/admin/login");
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-inverse text-on-inverse">
      <div className="border-b border-on-inverse/10 px-5 py-4">
        <p className="text-sm font-semibold tracking-tight">{siteConfig.name} Admin</p>
        <p className="mt-1 text-xs text-on-inverse/50">{role} · {canDeleteCatalogue(role) ? "edit & delete" : "edit only"}</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 text-sm">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2 px-5 py-2 text-on-inverse/70 hover:bg-on-inverse/5 hover:text-on-inverse",
                active && "bg-on-inverse/10 text-on-inverse",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-on-inverse/10 p-3">
        <div className="flex items-center justify-between px-2 py-2">
          <span className="text-xs text-on-inverse/50">Theme</span>
          <ThemeToggle className="text-on-inverse/70 hover:text-on-inverse" />
        </div>
        <Link href="/" className="block px-2 py-2 text-xs text-on-inverse/50 hover:text-on-inverse">
          View storefront
        </Link>
        <button onClick={logout} className="flex w-full items-center gap-2 px-2 py-2 text-left text-sm text-on-inverse/70 hover:text-on-inverse">
          <LogOut className="size-4" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-canvas lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block">{sidebar}</aside>
      {open ? <div className="fixed inset-0 z-50 lg:hidden">{sidebar}</div> : null}
      <div>
        <header className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Menu">
            <Menu className="size-5" />
          </button>
          <span className="font-medium">Admin</span>
          <ThemeToggle className="ml-auto" />
        </header>
        <div className={isPostEditor ? "p-0" : "p-4 lg:p-8"}>{children}</div>
      </div>
    </div>
  );
}

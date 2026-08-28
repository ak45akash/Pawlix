"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, LogOut, Menu } from "lucide-react";
import { AdminSearch } from "@/components/admin/admin-search";
import { siteConfig } from "@/config/site";
import { groupContainsActive, isNavItemActive, navGroupsForUser } from "@/lib/admin-nav";
import { useDemo } from "@/lib/demo-store";
import { ThemeToggle } from "@/lib/theme";
import { clearAdminCookie } from "@/lib/admin-session";
import { cn } from "@/lib/utils/cn";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { can, member, role } = useDemo();
  const [open, setOpen] = useState(false);
  const [openedGroups, setOpenedGroups] = useState<Record<string, boolean>>({});
  const isPostEditor = /^\/admin\/(blog|recipes)\/.+$/.test(pathname);
  const groups = navGroupsForUser(can);

  function logout() {
    clearAdminCookie();
    router.push("/admin/login");
  }

  function isGroupOpen(group: (typeof groups)[number]) {
    return Boolean(openedGroups[group.id]) || groupContainsActive(pathname, group);
  }

  function toggleGroup(id: string) {
    const group = groups.find((item) => item.id === id);
    if (group && groupContainsActive(pathname, group)) return;
    setOpenedGroups((current) => ({ ...current, [id]: !current[id] }));
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-inverse text-on-inverse">
      <div className="border-b border-on-inverse/10 px-4 py-4">
        <p className="text-sm font-semibold tracking-tight">{siteConfig.name}</p>
        <p className="text-xs text-on-inverse/50">Administration</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-2 text-sm">
        {groups.map((group) => {
          const singleItem = group.items.length === 1 && group.id === "overview";
          const isExpanded = isGroupOpen(group);

          if (singleItem) {
            const item = group.items[0];
            const active = isNavItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "mx-2 flex items-center gap-2 rounded-md px-3 py-2 text-on-inverse/70 hover:bg-on-inverse/5 hover:text-on-inverse",
                  active && "bg-on-inverse/10 text-on-inverse",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          }

          return (
            <div key={group.id} className="mb-1">
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="flex w-full items-center justify-between px-4 py-2 text-left text-[11px] font-semibold tracking-wide text-on-inverse/45 uppercase hover:text-on-inverse/70"
              >
                {group.label}
                <ChevronDown className={cn("size-3.5 transition-transform", isExpanded && "rotate-180")} />
              </button>
              {isExpanded ? (
                <div className="pb-1">
                  {group.items.map((item) => {
                    const active = isNavItemActive(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "mx-2 flex items-center gap-2 rounded-md px-3 py-2 text-on-inverse/70 hover:bg-on-inverse/5 hover:text-on-inverse",
                          active && "bg-on-inverse/10 text-on-inverse",
                        )}
                      >
                        <item.icon className="size-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
      <div className="border-t border-on-inverse/10 p-3">
        <p className="px-2 py-1 text-xs text-on-inverse/50">
          {member?.name ?? "Member"} · {role}
        </p>
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
    <div className="min-h-dvh bg-canvas lg:grid lg:grid-cols-[252px_1fr]">
      <aside className="hidden lg:block">{sidebar}</aside>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-inverse/40" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="relative h-full w-[min(18rem,88vw)] shadow-xl">{sidebar}</div>
        </div>
      ) : null}
      <div className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
            <button onClick={() => setOpen(true)} aria-label="Open menu" className="lg:hidden">
              <Menu className="size-5" />
            </button>
            <div className="hidden min-w-0 lg:block">
              <p className="truncate text-sm font-medium">{siteConfig.name} Admin</p>
              <p className="truncate text-xs text-ink-muted">Find any screen quickly</p>
            </div>
            <div className="flex-1 lg:ml-4">
              <AdminSearch can={can} />
            </div>
            <ThemeToggle className="hidden shrink-0 sm:inline-flex lg:hidden" />
          </div>
        </header>
        <div className={cn("flex-1", isPostEditor ? "p-0" : "p-4 lg:p-8")}>{children}</div>
      </div>
    </div>
  );
}

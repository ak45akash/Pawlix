"use client";

import Link from "next/link";
import { useDemo } from "@/lib/demo-store";
import { activeAnnouncements } from "@/lib/marketing";

export function SiteAnnouncementBar() {
  const { state } = useDemo();
  const live = activeAnnouncements(state);
  if (!live.length) return null;

  return (
    <div className="border-b border-border bg-accent-soft text-sm text-ink">
      <div className="store-shell flex flex-col gap-1 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-1">
        {live.map((item) => (
          <Link key={item.id} href={item.href} className="hover:text-accent">
            {item.message}
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import type { ReactNode } from "react";
import { RequireCapability } from "@/components/admin/guard";

export function RequireMarketing({ children }: { children: ReactNode }) {
  return <RequireCapability capability="seo.view">{children}</RequireCapability>;
}

export function MarketingPageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-muted">{description}</p>
    </div>
  );
}

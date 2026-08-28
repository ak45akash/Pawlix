"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useDemo } from "@/lib/demo-store";

const ALLOWED_DURING_MAINTENANCE = ["/contact"];

function MaintenanceScreen({ message }: { message: string }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-4 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Wrench className="size-7" aria-hidden />
      </div>
      <p className="mt-6 text-sm tracking-[0.2em] text-accent uppercase">{siteConfig.name}</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">We&apos;ll be back soon</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-muted">{message}</p>
      <p className="mt-8 text-xs text-ink-muted">The shop is temporarily unavailable while we make updates.</p>
      <Link href="/contact" className="mt-6 text-sm font-medium text-accent hover:underline">
        Contact us
      </Link>
    </div>
  );
}

export function StoreMaintenanceGate({ children }: { children: React.ReactNode }) {
  const { state } = useDemo();
  const pathname = usePathname();
  const allowed = ALLOWED_DURING_MAINTENANCE.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (state.settings.maintenanceMode && !allowed) {
    return (
      <MaintenanceScreen
        message={state.settings.maintenanceMessage || "We are updating the shop and will be back shortly."}
      />
    );
  }

  return children;
}

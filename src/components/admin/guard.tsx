"use client";

import type { ReactNode } from "react";
import type { Capability } from "@/lib/permissions/catalogue.ts";
import { useDemo } from "@/lib/demo-store";

export function RequireCapability({
  capability,
  children,
}: {
  capability: Capability;
  children: ReactNode;
}) {
  const { can } = useDemo();
  if (!can(capability)) {
    return (
      <div className="max-w-lg">
        <h1 className="text-2xl font-semibold tracking-tight">Not allowed</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Your role does not include {capability}. Ask an admin to change your rights.
        </p>
      </div>
    );
  }
  return children;
}

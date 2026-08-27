"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/shell";

function hasAdminCookie() {
  return document.cookie.split("; ").some((part) => part.startsWith("pawlix_admin="));
}

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!hasAdminCookie()) router.replace("/admin/login");
  }, [router]);

  return <AdminShell>{children}</AdminShell>;
}

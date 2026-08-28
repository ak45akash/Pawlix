"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/shell";
import { RequireCapability } from "@/components/admin/guard";
import { capabilityForPath, resolveMemberIdFromCookie } from "@/lib/permissions/access.ts";
import { useDemo } from "@/lib/demo-store";

function adminCookie() {
  return document.cookie.split("; ").find((part) => part.startsWith("pawlix_admin="))?.slice("pawlix_admin=".length);
}

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { state, setCurrentMember, can } = useDemo();
  const required = capabilityForPath(pathname);

  useEffect(() => {
    const cookie = adminCookie();
    if (!cookie) {
      router.replace("/admin/login");
      return;
    }
    const memberId = resolveMemberIdFromCookie(cookie, state);
    if (memberId && memberId !== state.currentMemberId) setCurrentMember(memberId);
  }, [router, setCurrentMember, state.currentMemberId, state.members]);

  const body = required && !can(required) ? <RequireCapability capability={required}>{null}</RequireCapability> : children;

  return <AdminShell>{body}</AdminShell>;
}

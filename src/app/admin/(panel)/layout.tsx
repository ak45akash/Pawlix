"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/shell";
import { RequireCapability } from "@/components/admin/guard";
import { readAdminCookie } from "@/lib/admin-session";
import { capabilityForPath, resolveMemberIdFromCookie } from "@/lib/permissions/access.ts";
import { useDemo } from "@/lib/demo-store";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { state, setCurrentMember, can } = useDemo();
  const required = capabilityForPath(pathname);
  const { members, currentMemberId } = state;

  useEffect(() => {
    const cookie = readAdminCookie();
    if (!cookie) {
      router.replace("/admin/login");
      return;
    }
    const memberId = resolveMemberIdFromCookie(cookie, { members });
    if (memberId && memberId !== currentMemberId) setCurrentMember(memberId);
  }, [router, setCurrentMember, currentMemberId, members]);

  const body = required && !can(required) ? <RequireCapability capability={required}>{null}</RequireCapability> : children;

  return <AdminShell>{body}</AdminShell>;
}

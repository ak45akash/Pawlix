import type { AdminMember, AdminRoleRecord, DemoState } from "@/types/catalog";
import { hasCapability, type Capability } from "@/lib/permissions/catalogue.ts";

export function roleById(roles: AdminRoleRecord[], id: string | undefined) {
  return roles.find((role) => role.id === id);
}

export function memberById(members: AdminMember[], id: string | undefined) {
  return members.find((member) => member.id === id);
}

export function memberRole(state: Pick<DemoState, "roles" | "members">, memberId: string | undefined) {
  const member = memberById(state.members, memberId);
  return roleById(state.roles, member?.roleId);
}

export function capabilitiesOf(state: Pick<DemoState, "roles" | "members">, memberId: string | undefined) {
  return memberRole(state, memberId)?.capabilities ?? [];
}

export function memberCan(
  state: Pick<DemoState, "roles" | "members">,
  memberId: string | undefined,
  capability: Capability,
) {
  return hasCapability(capabilitiesOf(state, memberId), capability);
}

export function membersWithCapability(state: Pick<DemoState, "roles" | "members">, capability: Capability) {
  return state.members.filter((member) => member.status === "active" && memberCan(state, member.id, capability));
}

export function resolveMemberIdFromCookie(cookie: string | undefined, state: Pick<DemoState, "members">) {
  if (!cookie) return state.members[0]?.id ?? "";
  if (state.members.some((member) => member.id === cookie)) return cookie;
  const email = cookie.includes("@") ? cookie.toLowerCase() : "";
  const byEmail = email ? state.members.find((member) => member.email === email) : undefined;
  if (byEmail) return byEmail.id;
  if (cookie === "ADMIN") return state.members.find((member) => member.email === "admin@pawlix.com")?.id ?? state.members[0]?.id ?? "";
  if (cookie === "STAFF") return state.members.find((member) => member.email === "staff@pawlix.com")?.id ?? "";
  return state.members[0]?.id ?? "";
}

export const ADMIN_ROUTE_CAPS: { prefix: string; cap: Capability }[] = [
  { prefix: "/admin/products", cap: "catalogue.edit" },
  { prefix: "/admin/pet-types", cap: "catalogue.edit" },
  { prefix: "/admin/categories", cap: "catalogue.edit" },
  { prefix: "/admin/subcategories", cap: "catalogue.edit" },
  { prefix: "/admin/brands", cap: "catalogue.edit" },
  { prefix: "/admin/inventory", cap: "inventory.adjust" },
  { prefix: "/admin/orders", cap: "orders.view" },
  { prefix: "/admin/customers", cap: "customers.view" },
  { prefix: "/admin/coupons", cap: "coupons.manage" },
  { prefix: "/admin/content", cap: "content.edit" },
  { prefix: "/admin/blog", cap: "content.edit" },
  { prefix: "/admin/recipes", cap: "content.edit" },
  { prefix: "/admin/reviews", cap: "content.edit" },
  { prefix: "/admin/seo", cap: "seo.view" },
  { prefix: "/admin/team", cap: "team.view" },
  { prefix: "/admin/roles", cap: "roles.manage" },
  { prefix: "/admin/reports", cap: "reports.view" },
  { prefix: "/admin/audit", cap: "audit.view" },
  { prefix: "/admin/settings", cap: "settings.edit" },
];

export function capabilityForPath(pathname: string): Capability | undefined {
  return ADMIN_ROUTE_CAPS.filter((route) => pathname === route.prefix || pathname.startsWith(`${route.prefix}/`)).sort(
    (a, b) => b.prefix.length - a.prefix.length,
  )[0]?.cap;
}

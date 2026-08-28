export function setAdminCookie(memberId: string) {
  document.cookie = `pawlix_admin=${memberId}; Path=/; Max-Age=604800; SameSite=Lax`;
}

export function clearAdminCookie() {
  document.cookie = "pawlix_admin=; Path=/; Max-Age=0";
}

export function readAdminCookie() {
  if (typeof document === "undefined") return "";
  return document.cookie.split("; ").find((part) => part.startsWith("pawlix_admin="))?.slice("pawlix_admin=".length) ?? "";
}

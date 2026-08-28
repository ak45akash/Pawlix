import { createId } from "@/lib/slug";
import type { AdminCredential, AdminPasswordReset, DemoState } from "@/types/catalog";

const HASH_PREFIX = "pwlix-demo-v1:";

export function hashPassword(password: string) {
  let hash = 5381;
  const input = `${HASH_PREFIX}${password}`;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash) ^ input.charCodeAt(i);
  }
  return `pwl_${(hash >>> 0).toString(16)}`;
}

export function verifyPassword(password: string, passwordHash: string) {
  return hashPassword(password) === passwordHash;
}

export function defaultAdminPasswordHash() {
  return hashPassword("admin123");
}

export function buildDefaultAdminCredentials(members: DemoState["members"]) {
  const hash = defaultAdminPasswordHash();
  const now = new Date().toISOString();
  return Object.fromEntries(members.map((member) => [member.id, { passwordHash: hash, updatedAt: now }]));
}

export function credentialForMember(state: DemoState, memberId: string): AdminCredential {
  return (
    state.adminCredentials[memberId] ?? {
      passwordHash: defaultAdminPasswordHash(),
      updatedAt: "2026-08-01T00:00:00.000Z",
    }
  );
}

export function authenticateAdminMember(state: DemoState, email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const member = state.members.find((row) => row.email.toLowerCase() === normalized);
  if (!member || member.status !== "active") return null;
  const credential = credentialForMember(state, member.id);
  if (!verifyPassword(password, credential.passwordHash)) return null;
  return member;
}

export function createPasswordReset(state: DemoState, email: string) {
  const normalized = email.trim().toLowerCase();
  const member = state.members.find((row) => row.email.toLowerCase() === normalized);
  if (!member || member.status !== "active") return null;

  const token = createId("reset");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
  const reset: AdminPasswordReset = {
    id: createId("pr"),
    memberId: member.id,
    token,
    expiresAt,
    createdAt: now.toISOString(),
  };

  return { member, reset };
}

export function findValidPasswordReset(state: DemoState, token: string) {
  const reset = state.adminPasswordResets.find((row) => row.token === token);
  if (!reset) return null;
  if (new Date(reset.expiresAt).getTime() < Date.now()) return null;
  const member = state.members.find((row) => row.id === reset.memberId);
  if (!member || member.status !== "active") return null;
  return { reset, member };
}

export function validateNewPassword(password: string, confirm: string) {
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");
  if (password !== confirm) throw new Error("Passwords do not match.");
}

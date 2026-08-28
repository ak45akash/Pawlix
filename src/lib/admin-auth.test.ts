import assert from "node:assert/strict";
import test from "node:test";
import { seedMembers } from "../data/roles-seed.ts";
import {
  authenticateAdminMember,
  buildDefaultAdminCredentials,
  createPasswordReset,
  findValidPasswordReset,
  hashPassword,
  validateNewPassword,
  verifyPassword,
} from "./admin-auth.ts";

const members = seedMembers.slice(0, 2);
const state = {
  members,
  adminCredentials: buildDefaultAdminCredentials(members),
  adminPasswordResets: [],
};

test("hashPassword and verifyPassword match for the same value", () => {
  const hash = hashPassword("admin123");
  assert.equal(verifyPassword("admin123", hash), true);
  assert.equal(verifyPassword("wrong", hash), false);
});

test("authenticateAdminMember accepts valid demo credentials", () => {
  const member = authenticateAdminMember(state as never, "admin@pawlix.com", "admin123");
  assert.equal(member?.id, "mem_admin");
  assert.equal(authenticateAdminMember(state as never, "admin@pawlix.com", "nope"), null);
});

test("validateNewPassword enforces length and confirmation", () => {
  assert.throws(() => validateNewPassword("short", "short"), /8 characters/);
  assert.throws(() => validateNewPassword("long-enough", "different"), /do not match/);
});

test("password reset token can be created and consumed", () => {
  const created = createPasswordReset(state as never, "admin@pawlix.com");
  assert.ok(created?.reset.token);
  const withReset = { ...state, adminPasswordResets: [created!.reset] };
  const match = findValidPasswordReset(withReset as never, created!.reset.token);
  assert.equal(match?.member.id, "mem_admin");
});

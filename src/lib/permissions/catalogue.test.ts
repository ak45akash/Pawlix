import assert from "node:assert/strict";
import test from "node:test";
import { seedRoles } from "../../data/roles-seed.ts";
import {
  assertCapability,
  canDeleteCatalogue,
  canEditCatalogue,
  canEditSku,
  hasCapability,
} from "./catalogue.ts";
import { capabilitiesOf, memberCan } from "./access.ts";
import type { DemoState } from "../../types/catalog.ts";

const staff = seedRoles.find((role) => role.slug === "staff");
const admin = seedRoles.find((role) => role.slug === "admin");
const manager = seedRoles.find((role) => role.slug === "manager");
const editor = seedRoles.find((role) => role.slug === "editor");

test("ADMIN can edit and delete catalogue records and SKUs", () => {
  assert.ok(admin);
  assert.equal(canEditCatalogue(admin.capabilities), true);
  assert.equal(canDeleteCatalogue(admin.capabilities), true);
  assert.equal(canEditSku(admin.capabilities), true);
});

test("STAFF can edit SKUs but cannot delete catalogue records", () => {
  assert.ok(staff);
  assert.equal(canEditCatalogue(staff.capabilities), true);
  assert.equal(canEditSku(staff.capabilities), true);
  assert.equal(canDeleteCatalogue(staff.capabilities), false);
  assert.equal(hasCapability(staff.capabilities, "catalogue.delete"), false);
});

test("Manager cannot manage roles; editor is content-only", () => {
  assert.ok(manager);
  assert.ok(editor);
  assert.equal(hasCapability(manager.capabilities, "roles.manage"), false);
  assert.equal(hasCapability(manager.capabilities, "orders.edit"), true);
  assert.equal(hasCapability(editor.capabilities, "catalogue.edit"), false);
  assert.equal(hasCapability(editor.capabilities, "content.publish"), true);
});

test("assertCapability throws when missing", () => {
  assert.ok(staff);
  assert.throws(() => assertCapability(staff.capabilities, "catalogue.delete"));
});

test("memberCan reads the assigned role", () => {
  const state = {
    roles: seedRoles,
    members: [
      {
        id: "mem_x",
        name: "X",
        email: "x@pawlix.com",
        roleId: "role_editor",
        status: "active" as const,
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ],
  } as Pick<DemoState, "roles" | "members">;
  assert.equal(memberCan(state, "mem_x", "content.edit"), true);
  assert.equal(memberCan(state, "mem_x", "catalogue.delete"), false);
  assert.equal(capabilitiesOf(state, "missing").length, 0);
});

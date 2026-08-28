import assert from "node:assert/strict";
import test from "node:test";
import {
  ROLE_CAPABILITIES,
  assertCapability,
  canDeleteCatalogue,
  canEditCatalogue,
  canEditSku,
  hasCapability,
} from "./catalogue.ts";

test("ADMIN can edit and delete catalogue records and SKUs", () => {
  assert.equal(canEditCatalogue(ROLE_CAPABILITIES.ADMIN), true);
  assert.equal(canDeleteCatalogue(ROLE_CAPABILITIES.ADMIN), true);
  assert.equal(canEditSku(ROLE_CAPABILITIES.ADMIN), true);
});

test("STAFF can edit SKUs but cannot delete catalogue records", () => {
  assert.equal(canEditCatalogue(ROLE_CAPABILITIES.STAFF), true);
  assert.equal(canEditSku(ROLE_CAPABILITIES.STAFF), true);
  assert.equal(canDeleteCatalogue(ROLE_CAPABILITIES.STAFF), false);
  assert.equal(hasCapability(ROLE_CAPABILITIES.STAFF, "catalogue.delete"), false);
});

test("Manager cannot manage roles; editor is content-only", () => {
  assert.equal(hasCapability(ROLE_CAPABILITIES.MANAGER, "roles.manage"), false);
  assert.equal(hasCapability(ROLE_CAPABILITIES.MANAGER, "orders.edit"), true);
  assert.equal(hasCapability(ROLE_CAPABILITIES.EDITOR, "catalogue.edit"), false);
  assert.equal(hasCapability(ROLE_CAPABILITIES.EDITOR, "content.publish"), true);
});

test("assertCapability throws when missing", () => {
  assert.throws(() => assertCapability(ROLE_CAPABILITIES.STAFF, "catalogue.delete"));
});

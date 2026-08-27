import assert from "node:assert/strict";
import test from "node:test";
import {
  canDeleteCatalogue,
  canEditCatalogue,
  canEditSku,
  hasCapability,
} from "./catalogue.ts";

test("ADMIN can edit and delete catalogue records and SKUs", () => {
  assert.equal(canEditCatalogue("ADMIN"), true);
  assert.equal(canDeleteCatalogue("ADMIN"), true);
  assert.equal(canEditSku("ADMIN"), true);
});

test("STAFF can edit SKUs but cannot delete catalogue records", () => {
  assert.equal(canEditCatalogue("STAFF"), true);
  assert.equal(canEditSku("STAFF"), true);
  assert.equal(canDeleteCatalogue("STAFF"), false);
  assert.equal(hasCapability("STAFF", "catalogue.delete"), false);
});

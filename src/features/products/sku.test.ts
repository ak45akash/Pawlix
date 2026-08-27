import assert from "node:assert/strict";
import test from "node:test";
import {
  buildProductSku,
  buildVariantSku,
  normalizeSku,
  resolveSku,
  SkuError,
} from "./sku.ts";

test("auto-generates a product SKU from pet type and category", () => {
  const result = resolveSku({
    sequential: 1,
    petTypeSlug: "dog",
    categorySlug: "food",
  });
  assert.equal(result.sku, "PWL-DOG-FOOD-0001");
  assert.equal(result.source, "auto");
});

test("accepts a manual admin SKU and normalizes it", () => {
  const result = resolveSku({
    sequential: 1,
    submittedSku: " dog-treat-12 ",
    existingSkus: ["PWL-DOG-FOOD-0001"],
  });
  assert.equal(result.sku, "DOG-TREAT-12");
  assert.equal(result.source, "manual");
});

test("does not overwrite a manual SKU when the field is left blank", () => {
  const result = resolveSku({
    sequential: 9,
    petTypeSlug: "cat",
    categorySlug: "toys",
    previousSku: "CUSTOM-99",
    previousSource: "manual",
    submittedSku: "",
  });
  assert.equal(result.sku, "CUSTOM-99");
  assert.equal(result.source, "manual");
});

test("bumps the sequence when an auto SKU is already taken", () => {
  const result = resolveSku({
    sequential: 1,
    petTypeSlug: "dog",
    categorySlug: "food",
    existingSkus: ["PWL-DOG-FOOD-0001"],
  });
  assert.equal(result.sku, "PWL-DOG-FOOD-0002");
});

test("rejects a duplicate manual SKU", () => {
  assert.throws(
    () =>
      resolveSku({
        sequential: 1,
        submittedSku: "PWL-DOG-FOOD-0001",
        existingSkus: ["PWL-DOG-FOOD-0001"],
      }),
    SkuError,
  );
});

test("builds a variant SKU from the parent", () => {
  assert.equal(buildVariantSku("PWL-DOG-FOOD-0001", "1kg"), "PWL-DOG-FOOD-0001-1KG");
});

test("normalizes spacing and case", () => {
  assert.equal(normalizeSku("  pwl dog  food "), "PWL-DOG-FOOD");
});

test("formats sequential product SKUs", () => {
  assert.equal(
    buildProductSku({ petTypeSlug: "bird", categorySlug: "accessories", sequential: 12 }),
    "PWL-BIRD-ACCE-0012",
  );
});

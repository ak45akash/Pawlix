import {
  SKU_CODE_LENGTH,
  SKU_MAX_LENGTH,
  SKU_MIN_LENGTH,
  SKU_PATTERN,
  SKU_PREFIX,
  SKU_SEQ_DIGITS,
} from "../../config/sku.ts";

export type SkuSource = "auto" | "manual";

export type SkuResolution = {
  sku: string;
  source: SkuSource;
};

export class SkuError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SkuError";
  }
}

export function slugToSkuCode(slug: string, length = SKU_CODE_LENGTH) {
  const compact = slug.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!compact) return "GEN";
  return compact.slice(0, length);
}

export function normalizeSku(input: string) {
  return input.trim().toUpperCase().replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export function isValidSkuFormat(sku: string) {
  return (
    sku.length >= SKU_MIN_LENGTH &&
    sku.length <= SKU_MAX_LENGTH &&
    SKU_PATTERN.test(sku)
  );
}

export function formatSequential(value: number) {
  if (!Number.isInteger(value) || value < 1) {
    throw new SkuError("SKU sequence must be a positive integer.");
  }
  return String(value).padStart(SKU_SEQ_DIGITS, "0");
}

export function buildProductSku(input: {
  petTypeSlug?: string | null;
  categorySlug?: string | null;
  sequential: number;
}) {
  const pet = slugToSkuCode(input.petTypeSlug ?? "gen");
  const category = slugToSkuCode(input.categorySlug ?? "gen");
  return `${SKU_PREFIX}-${pet}-${category}-${formatSequential(input.sequential)}`;
}

export function buildVariantSku(productSku: string, variantLabel: string) {
  const parent = normalizeSku(productSku);
  const variant = slugToSkuCode(variantLabel, 8);
  const sku = `${parent}-${variant}`;
  if (!isValidSkuFormat(sku)) {
    throw new SkuError("Generated variant SKU is not valid.");
  }
  return sku;
}

export function assertUniqueSku(sku: string, existingSkus: Iterable<string>) {
  const taken = new Set(Array.from(existingSkus, (value) => normalizeSku(value)));
  if (taken.has(sku)) {
    throw new SkuError(`SKU "${sku}" is already in use.`);
  }
}

function bumpSequential(sku: string) {
  const match = sku.match(/^(.*-)(\d+)$/);
  if (!match) {
    return `${sku}-2`;
  }
  const next = Number(match[2]) + 1;
  return `${match[1]}${formatSequential(next)}`;
}

export function nextAvailableSku(candidate: string, existingSkus: Iterable<string>) {
  const taken = new Set(Array.from(existingSkus, (value) => normalizeSku(value)));
  let sku = candidate;
  let guard = 0;
  while (taken.has(sku)) {
    sku = bumpSequential(sku);
    guard += 1;
    if (guard > 10_000) {
      throw new SkuError("Could not find an unused SKU.");
    }
  }
  return sku;
}

export function resolveSku(input: {
  submittedSku?: string | null;
  previousSku?: string | null;
  previousSource?: SkuSource | null;
  petTypeSlug?: string | null;
  categorySlug?: string | null;
  sequential: number;
  existingSkus?: Iterable<string>;
  variantLabel?: string | null;
}): SkuResolution {
  const existing = input.existingSkus ?? [];
  const submitted = input.submittedSku?.trim() ?? "";

  if (submitted) {
    const sku = normalizeSku(submitted);
    if (!isValidSkuFormat(sku)) {
      throw new SkuError(
        "SKU must be 3–40 characters using letters, numbers, and hyphens only.",
      );
    }
    const others = Array.from(existing).filter(
      (value) => normalizeSku(value) !== normalizeSku(input.previousSku ?? ""),
    );
    assertUniqueSku(sku, others);
    const unchanged = input.previousSku
      ? normalizeSku(input.previousSku) === sku
      : false;
    return {
      sku,
      source: unchanged ? (input.previousSource ?? "manual") : "manual",
    };
  }

  if (input.previousSource === "manual" && input.previousSku) {
    const sku = normalizeSku(input.previousSku);
    return { sku, source: "manual" };
  }

  const generated = input.variantLabel
    ? buildVariantSku(
        input.previousSku ??
          buildProductSku({
            petTypeSlug: input.petTypeSlug,
            categorySlug: input.categorySlug,
            sequential: input.sequential,
          }),
        input.variantLabel,
      )
    : buildProductSku({
        petTypeSlug: input.petTypeSlug,
        categorySlug: input.categorySlug,
        sequential: input.sequential,
      });

  const others = Array.from(existing).filter(
    (value) => normalizeSku(value) !== normalizeSku(input.previousSku ?? ""),
  );

  return {
    sku: nextAvailableSku(generated, others),
    source: "auto",
  };
}

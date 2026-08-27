/** Central SKU rules — change here, not in forms or database defaults. */

export const SKU_PREFIX = "PWL";
export const SKU_CODE_LENGTH = 4;
export const SKU_SEQ_DIGITS = 4;
export const SKU_MAX_LENGTH = 40;
export const SKU_MIN_LENGTH = 3;

/** Uppercase letters, numbers, and hyphens. No spaces or symbols. */
export const SKU_PATTERN = /^[A-Z0-9]+(?:-[A-Z0-9]+)*$/;

import crypto from "crypto";

/**
 * Generates a unique SKU in the format: SKU-XXXXXXXX
 * Uses crypto.randomBytes for strong randomness.
 *
 * @param prefix - Optional custom prefix (default: "SKU")
 * @returns A unique uppercase SKU string
 *
 * @example generateSku()        → "SKU-3F8A1B2C"
 * @example generateSku("ELEC")  → "ELEC-A7D2E9F1"
 */
export const generateSku = (prefix: string = "SKU"): string => {
  const randomHex = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}-${randomHex}`;
};

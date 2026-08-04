/**
 * Shared input validation helpers for CopyrightStellar frontend.
 * Centralizes validation logic that was previously scattered across pages.
 */

/** 
 * Validates a Stellar public key format (G... , 56 chars, base32) 
 * @param address The string to validate
 */
export function isValidStellarAddress(address: string): boolean {
  return /^G[A-Z2-7]{54,55}$/.test(address);
}

/** Validates a 64-character hex SHA-256 hash */
export function isValidSha256Hex(hash: string): boolean {
  return /^[0-9a-fA-F]{64}$/.test(hash);
}

/** Validates a positive numeric XLM amount string */
export function isValidXlmAmount(amount: string): boolean {
  const parsed = parseFloat(amount);
  return !isNaN(parsed) && parsed > 0 && isFinite(parsed);
}

/** Validates basis points value (1-10000) */
export function isValidBasisPoints(bp: number): boolean {
  return Number.isInteger(bp) && bp > 0 && bp <= 10000;
}

/** Validates a work ID is a positive integer */
export function isValidWorkId(id: number): boolean {
  return Number.isInteger(id) && id > 0;
}

/** Validates a work title is non-empty and within length limits */
export function isValidTitle(title: string): boolean {
  const trimmed = title.trim();
  return trimmed.length > 0 && trimmed.length <= 256;
}

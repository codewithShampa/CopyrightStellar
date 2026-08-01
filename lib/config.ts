/**
 * Application-wide configuration constants for CopyrightStellar.
 * Separates tunable values from business logic.
 */

/** Transaction polling interval in milliseconds */
export const TX_POLL_INTERVAL_MS = 2000;

/** Network health check interval in milliseconds */
export const HEALTH_CHECK_INTERVAL_MS = 30000;

/** Wallet balance refresh interval in milliseconds */
export const BALANCE_REFRESH_INTERVAL_MS = 10000;

/** Maximum file size for hashing (100 MB) */
export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

/** Basis point total that shares must sum to */
export const TOTAL_BASIS_POINTS = 10000;

/** Minimum number of co-creators in a split sheet */
export const MIN_CREATORS = 2;

/** Transaction timeout in seconds */
export const TX_TIMEOUT_SECONDS = 30;

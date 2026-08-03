/**
 * Formatting utilities for CopyrightStellar.
 * Centralizes display formatting that was previously inline across pages.
 */

/** Truncate a Stellar address for display: GABCD...WXYZ */
export function truncateAddress(address: string, start = 4, end = 4): string {
  if (!address || address.length <= start + end + 3) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/** Format a file size in bytes to human-readable string */
export function formatFileSize(bytes: number): string {
  if (bytes < 0) return '0 B';
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** Format a Unix timestamp (seconds) to locale date string */
export function formatTimestamp(ts: number): string {
  if (!ts || ts <= 0) return 'Unknown';
  return new Date(ts * 1000).toLocaleString();
}

/** Format basis points (0-10000) as a percentage string */
export function basisPointsToPercent(bp: number): string {
  return `${(bp / 100).toFixed(2)}%`;
}

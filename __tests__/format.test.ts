import { describe, it, expect } from 'vitest';
import { truncateAddress, formatFileSize, formatTimestamp, basisPointsToPercent } from '@/lib/format';

describe('truncateAddress', () => {
  it('truncates a long Stellar address', () => {
    const addr = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUVW';
    expect(truncateAddress(addr)).toMatch(/^GABC\.\.\.TUVW$/);
  });

  it('returns short strings unmodified', () => {
    expect(truncateAddress('GABC')).toBe('GABC');
  });

  it('handles empty string', () => {
    expect(truncateAddress('')).toBe('');
  });
});

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(512)).toBe('512 B');
  });

  it('formats kilobytes', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });

  it('formats megabytes', () => {
    expect(formatFileSize(2 * 1024 * 1024)).toBe('2.0 MB');
  });

  it('handles zero', () => {
    expect(formatFileSize(0)).toBe('0 B');
  });

  it('handles negative values', () => {
    expect(formatFileSize(-100)).toBe('0 B');
  });
});

describe('formatTimestamp', () => {
  it('formats a valid unix timestamp', () => {
    const result = formatTimestamp(1690000000);
    expect(result).toBeTruthy();
    expect(result).not.toBe('Unknown');
  });

  it('returns Unknown for zero', () => {
    expect(formatTimestamp(0)).toBe('Unknown');
  });

  it('returns Unknown for negative', () => {
    expect(formatTimestamp(-1)).toBe('Unknown');
  });
});

describe('basisPointsToPercent', () => {
  it('converts 10000 to 100.00%', () => {
    expect(basisPointsToPercent(10000)).toBe('100.00%');
  });

  it('converts 2500 to 25.00%', () => {
    expect(basisPointsToPercent(2500)).toBe('25.00%');
  });

  it('converts 33 to 0.33%', () => {
    expect(basisPointsToPercent(33)).toBe('0.33%');
  });
});

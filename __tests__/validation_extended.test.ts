import { describe, it, expect } from 'vitest';
import { isValidWorkId, isValidTitle, isValidBasisPoints } from '@/lib/validation';

describe('isValidWorkId', () => {
  it('accepts positive integer IDs', () => {
    expect(isValidWorkId(1)).toBe(true);
    expect(isValidWorkId(42)).toBe(true);
    expect(isValidWorkId(9999)).toBe(true);
  });

  it('rejects zero, negative, and floating numbers', () => {
    expect(isValidWorkId(0)).toBe(false);
    expect(isValidWorkId(-5)).toBe(false);
    expect(isValidWorkId(1.5)).toBe(false);
    expect(isValidWorkId(NaN)).toBe(false);
  });
});

describe('isValidTitle', () => {
  it('accepts valid non-empty titles', () => {
    expect(isValidTitle('My Creative Song')).toBe(true);
    expect(isValidTitle('A')).toBe(true);
  });

  it('rejects empty or whitespace-only titles', () => {
    expect(isValidTitle('')).toBe(false);
    expect(isValidTitle('   ')).toBe(false);
  });

  it('rejects titles exceeding 256 characters', () => {
    expect(isValidTitle('A'.repeat(257))).toBe(false);
    expect(isValidTitle('A'.repeat(256))).toBe(true);
  });
});

describe('isValidBasisPoints edge cases', () => {
  it('accepts bounds 1 and 10000', () => {
    expect(isValidBasisPoints(1)).toBe(true);
    expect(isValidBasisPoints(10000)).toBe(true);
  });

  it('rejects 0 and 10001', () => {
    expect(isValidBasisPoints(0)).toBe(false);
    expect(isValidBasisPoints(10001)).toBe(false);
  });
});

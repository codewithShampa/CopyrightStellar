import { describe, it, expect } from 'vitest';
import {
  isValidStellarAddress,
  isValidSha256Hex,
  isValidXlmAmount,
  isValidBasisPoints,
} from '@/lib/validation';

describe('isValidStellarAddress', () => {
  it('accepts a valid G-address', () => {
    expect(isValidStellarAddress('GDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2OISGN5')).toBe(true);
  });

  it('rejects an address that is too short', () => {
    expect(isValidStellarAddress('GDLZFC3S')).toBe(false);
  });

  it('rejects an address not starting with G', () => {
    expect(isValidStellarAddress('CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2OISGN5')).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(isValidStellarAddress('')).toBe(false);
  });

  it('rejects addresses with invalid characters', () => {
    expect(isValidStellarAddress('GDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2OISGN!')).toBe(false);
  });
});

describe('isValidSha256Hex', () => {
  it('accepts a valid 64-char hex hash', () => {
    expect(isValidSha256Hex('a'.repeat(64))).toBe(true);
    expect(isValidSha256Hex('ABCDEFabcdef0123456789'.padEnd(64, '0'))).toBe(true);
  });

  it('rejects hashes that are too short', () => {
    expect(isValidSha256Hex('abc123')).toBe(false);
  });

  it('rejects hashes that are too long', () => {
    expect(isValidSha256Hex('a'.repeat(65))).toBe(false);
  });

  it('rejects non-hex characters', () => {
    expect(isValidSha256Hex('g'.repeat(64))).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidSha256Hex('')).toBe(false);
  });
});

describe('isValidXlmAmount', () => {
  it('accepts positive numbers', () => {
    expect(isValidXlmAmount('1.5')).toBe(true);
    expect(isValidXlmAmount('100')).toBe(true);
    expect(isValidXlmAmount('0.0001')).toBe(true);
  });

  it('rejects zero', () => {
    expect(isValidXlmAmount('0')).toBe(false);
  });

  it('rejects negative numbers', () => {
    expect(isValidXlmAmount('-5')).toBe(false);
  });

  it('rejects non-numeric strings', () => {
    expect(isValidXlmAmount('abc')).toBe(false);
    expect(isValidXlmAmount('')).toBe(false);
  });

  it('rejects Infinity', () => {
    expect(isValidXlmAmount('Infinity')).toBe(false);
  });
});

describe('isValidBasisPoints', () => {
  it('accepts values between 1 and 10000', () => {
    expect(isValidBasisPoints(1)).toBe(true);
    expect(isValidBasisPoints(5000)).toBe(true);
    expect(isValidBasisPoints(10000)).toBe(true);
  });

  it('rejects zero', () => {
    expect(isValidBasisPoints(0)).toBe(false);
  });

  it('rejects values over 10000', () => {
    expect(isValidBasisPoints(10001)).toBe(false);
  });

  it('rejects negative values', () => {
    expect(isValidBasisPoints(-100)).toBe(false);
  });

  it('rejects non-integer values', () => {
    expect(isValidBasisPoints(50.5)).toBe(false);
  });
});

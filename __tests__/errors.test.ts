import { describe, it, expect } from 'vitest';
import {
  AppError,
  WalletError,
  ContractError,
  ValidationError,
  NetworkError,
  getErrorMessage,
} from '@/lib/errors';

describe('AppError', () => {
  it('stores code and message', () => {
    const err = new AppError('test', 'TEST_CODE');
    expect(err.message).toBe('test');
    expect(err.code).toBe('TEST_CODE');
    expect(err.name).toBe('AppError');
  });
});

describe('WalletError', () => {
  it('is an instance of AppError', () => {
    const err = new WalletError('connection failed');
    expect(err).toBeInstanceOf(AppError);
    expect(err.code).toBe('WALLET_ERROR');
  });
});

describe('ContractError', () => {
  it('has CONTRACT_ERROR code', () => {
    const err = new ContractError('simulation failed');
    expect(err.code).toBe('CONTRACT_ERROR');
    expect(err.name).toBe('ContractError');
  });
});

describe('ValidationError', () => {
  it('has VALIDATION_ERROR code', () => {
    const err = new ValidationError('invalid address');
    expect(err.code).toBe('VALIDATION_ERROR');
  });
});

describe('NetworkError', () => {
  it('has NETWORK_ERROR code', () => {
    const err = new NetworkError('timeout');
    expect(err.code).toBe('NETWORK_ERROR');
  });
});

describe('getErrorMessage', () => {
  it('extracts message from AppError', () => {
    expect(getErrorMessage(new WalletError('bad'))).toBe('bad');
  });

  it('extracts message from plain Error', () => {
    expect(getErrorMessage(new Error('oops'))).toBe('oops');
  });

  it('returns fallback for non-error', () => {
    expect(getErrorMessage('string error')).toBe('An unexpected error occurred');
  });

  it('returns fallback for null', () => {
    expect(getErrorMessage(null)).toBe('An unexpected error occurred');
  });
});

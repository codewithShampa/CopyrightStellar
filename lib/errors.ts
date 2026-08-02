/**
 * Custom error classes for CopyrightStellar.
 * Provides typed error handling across the application.
 */

/** Base error for all CopyrightStellar errors */
export class AppError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'AppError';
  }
}

/** Thrown when wallet connection or signing fails */
export class WalletError extends AppError {
  constructor(message: string) {
    super(message, 'WALLET_ERROR');
    this.name = 'WalletError';
  }
}

/** Thrown when a contract simulation or call fails */
export class ContractError extends AppError {
  constructor(message: string) {
    super(message, 'CONTRACT_ERROR');
    this.name = 'ContractError';
  }
}

/** Thrown when input validation fails */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

/** Thrown when network or RPC calls fail */
export class NetworkError extends AppError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

/** Extract a user-friendly message from any error */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}

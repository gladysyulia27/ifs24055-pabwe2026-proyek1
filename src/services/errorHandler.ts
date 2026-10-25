/**
 * Centralized Service Error Handler
 *
 * Normalizes all error types (ApiError, standard Error, network failures) into
 * user-friendly, structured ServiceError instances.
 */
import { ApiError } from "./api";

export class ServiceError extends Error {
  readonly status: number;
  readonly isNetworkError: boolean;
  readonly isValidationError: boolean;
  readonly originalError: unknown;

  constructor(
    message: string,
    status = 500,
    options?: { isNetworkError?: boolean; isValidationError?: boolean; originalError?: unknown }
  ) {
    super(message);
    this.name = "ServiceError";
    this.message = message;
    this.status = status;
    this.isNetworkError = options?.isNetworkError ?? false;
    this.isValidationError = options?.isValidationError ?? false;
    this.originalError = options?.originalError;
    Object.setPrototypeOf(this, ServiceError.prototype);
  }
}

/**
 * Normalizes any error thrown during service execution into a ServiceError.
 */
export function handleServiceError(error: unknown, fallbackMessage = "Terjadi kesalahan saat memproses data."): never {
  if (error instanceof ServiceError) {
    throw error;
  }

  if (error instanceof ApiError) {
    throw new ServiceError(error.message || fallbackMessage, error.status, {
      isNetworkError: error.isNetworkError,
      isValidationError: error.status === 400 || error.status === 422,
      originalError: error
    });
  }

  if (error instanceof Error) {
    throw new ServiceError(error.message || fallbackMessage, 400, {
      isValidationError: true,
      originalError: error
    });
  }

  if (typeof error === "string") {
    throw new ServiceError(error, 400, { isValidationError: true, originalError: error });
  }

  throw new ServiceError(fallbackMessage, 500, { originalError: error });
}

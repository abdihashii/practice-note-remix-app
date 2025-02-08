import { SecurityErrorType, type ErrorResponse } from "@notes-app/types";

/**
 * Handles API error responses with user-friendly messages from the backend
 */
export class APIError extends Error {
  readonly type: SecurityErrorType;
  readonly code: number;
  readonly timestamp: string;
  readonly data?: ErrorResponse;

  constructor(errorResponse: ErrorResponse) {
    super(errorResponse.error.message);
    this.name = "APIError";
    this.type = errorResponse.error.type;
    this.code = errorResponse.error.code;
    this.timestamp = errorResponse.error.timestamp;
    this.data = errorResponse;
  }

  /**
   * Check if error matches one or more types
   */
  is(...types: SecurityErrorType[]): boolean {
    return types.includes(this.type);
  }

  /**
   * Get user-friendly message, prioritizing backend messages
   *
   * @returns The user-friendly error message
   */
  getUserMessage(): string {
    // For validation errors, combine field-specific messages
    if (this.is(SecurityErrorType.VALIDATION)) {
      return this.getValidationMessage();
    }

    // For auth errors, use the reason from backend
    if (this.data?.error.authError?.reason) {
      return this.data.error.authError.reason;
    }

    // For token errors, use the reason from backend
    if (this.data?.error.tokenError?.reason) {
      return this.data.error.tokenError.reason;
    }

    // For resource errors, use the reason from backend
    if (this.data?.error.resourceError?.reason) {
      return this.data.error.resourceError.reason;
    }

    // Fallback to the main error message from backend
    return this.data?.error.message || "An unexpected error occurred";
  }

  /**
   * Get formatted validation error message
   *
   * @returns The formatted validation error message
   */
  private getValidationMessage(): string {
    const validationErrors = this.data?.error.validationErrors;
    if (!validationErrors?.length) {
      return this.data?.error.message || "Invalid input provided";
    }

    // Return first validation error for simplicity
    return validationErrors[0].message;
  }

  /**
   * Get technical error details for logging
   *
   * @returns The technical error details
   */
  getTechnicalDetails(): Record<string, unknown> {
    return {
      type: this.type,
      code: this.code,
      timestamp: this.timestamp,
      details: this.data?.error.details,
      validationErrors: this.data?.error.validationErrors,
      authError: this.data?.error.authError,
      tokenError: this.data?.error.tokenError,
      resourceError: this.data?.error.resourceError,
    };
  }
}

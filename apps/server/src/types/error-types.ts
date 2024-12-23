/**
 * Security Error Types and Response Interfaces
 *
 * This module provides a comprehensive type system for handling API errors.
 * It is designed to be easily consumable by frontend applications and API clients.
 */

// Security-related error types
export enum SecurityErrorType {
  // Authentication Errors (401)
  AUTHENTICATION = "AUTHENTICATION_ERROR", // Generic authentication error
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS", // Wrong username/password
  ACCOUNT_DISABLED = "ACCOUNT_DISABLED", // Account exists but is disabled
  EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED", // Email verification required

  // Authorization Errors (403)
  AUTHORIZATION = "AUTHORIZATION_ERROR", // Generic authorization error
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS", // Missing required permissions
  RESOURCE_ACCESS_DENIED = "RESOURCE_ACCESS_DENIED", // No access to resource

  // Token Errors (401)
  INVALID_TOKEN = "INVALID_TOKEN", // Token is malformed or invalid
  TOKEN_EXPIRED = "TOKEN_EXPIRED", // Token has expired
  TOKEN_REVOKED = "TOKEN_REVOKED", // Token was revoked (e.g., after password change)
  TOKEN_REUSE = "TOKEN_REUSE_DETECTED", // Attempted reuse of a refresh token

  // CSRF Errors (403)
  CSRF = "CSRF_ERROR", // Generic CSRF error
  INVALID_CSRF_TOKEN = "INVALID_CSRF_TOKEN", // CSRF token is invalid
  MISSING_CSRF_TOKEN = "MISSING_CSRF_TOKEN", // CSRF token is missing

  // Validation Errors (422)
  VALIDATION = "VALIDATION_ERROR", // Generic validation error
  INVALID_INPUT = "INVALID_INPUT", // Input data is invalid
  MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD", // Required field is missing
  INVALID_FORMAT = "INVALID_FORMAT", // Field format is invalid
  INVALID_LENGTH = "INVALID_LENGTH", // Field length is invalid

  // Resource Errors (404, 409)
  RESOURCE = "RESOURCE_ERROR", // Generic resource error
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND", // Resource doesn't exist
  RESOURCE_ALREADY_EXISTS = "RESOURCE_ALREADY_EXISTS", // Resource already exists
  RESOURCE_CONFLICT = "RESOURCE_CONFLICT", // Resource state conflict

  // Password Errors (400)
  PASSWORD = "PASSWORD_ERROR", // Generic password error
  WEAK_PASSWORD = "WEAK_PASSWORD", // Password doesn't meet requirements
  PASSWORD_MISMATCH = "PASSWORD_MISMATCH", // Passwords don't match
  PASSWORD_RECENTLY_USED = "PASSWORD_RECENTLY_USED", // Password was recently used

  // General Security Errors (500)
  SECURITY_POLICY = "SECURITY_POLICY_ERROR", // Security policy violation
  INVALID_OPERATION = "INVALID_OPERATION", // Operation not allowed
  SERVER_ERROR = "SERVER_ERROR", // Internal server error
}

/**
 * Maps error types to their typical HTTP status codes
 * Useful for client-side error handling
 */
export const ErrorTypeStatusMap: Record<SecurityErrorType, number> = {
  // Authentication errors -> 401
  [SecurityErrorType.AUTHENTICATION]: 401,
  [SecurityErrorType.INVALID_CREDENTIALS]: 401,
  [SecurityErrorType.ACCOUNT_DISABLED]: 401,
  [SecurityErrorType.EMAIL_NOT_VERIFIED]: 401,

  // Authorization errors -> 403
  [SecurityErrorType.AUTHORIZATION]: 403,
  [SecurityErrorType.INSUFFICIENT_PERMISSIONS]: 403,
  [SecurityErrorType.RESOURCE_ACCESS_DENIED]: 403,

  // Token errors -> 401
  [SecurityErrorType.INVALID_TOKEN]: 401,
  [SecurityErrorType.TOKEN_EXPIRED]: 401,
  [SecurityErrorType.TOKEN_REVOKED]: 401,
  [SecurityErrorType.TOKEN_REUSE]: 401,

  // CSRF errors -> 403
  [SecurityErrorType.CSRF]: 403,
  [SecurityErrorType.INVALID_CSRF_TOKEN]: 403,
  [SecurityErrorType.MISSING_CSRF_TOKEN]: 403,

  // Validation errors -> 422
  [SecurityErrorType.VALIDATION]: 422,
  [SecurityErrorType.INVALID_INPUT]: 422,
  [SecurityErrorType.MISSING_REQUIRED_FIELD]: 422,
  [SecurityErrorType.INVALID_FORMAT]: 422,
  [SecurityErrorType.INVALID_LENGTH]: 422,

  // Resource errors -> 404/409
  [SecurityErrorType.RESOURCE]: 404,
  [SecurityErrorType.RESOURCE_NOT_FOUND]: 404,
  [SecurityErrorType.RESOURCE_ALREADY_EXISTS]: 409,
  [SecurityErrorType.RESOURCE_CONFLICT]: 409,

  // Password errors -> 400
  [SecurityErrorType.PASSWORD]: 400,
  [SecurityErrorType.WEAK_PASSWORD]: 400,
  [SecurityErrorType.PASSWORD_MISMATCH]: 400,
  [SecurityErrorType.PASSWORD_RECENTLY_USED]: 400,

  // General security errors -> 500
  [SecurityErrorType.SECURITY_POLICY]: 500,
  [SecurityErrorType.INVALID_OPERATION]: 500,
  [SecurityErrorType.SERVER_ERROR]: 500,
};

/**
 * Validation error details
 * Used to provide specific information about field validation failures
 */
export interface ValidationError {
  field: string; // The field that failed validation
  message: string; // Human-readable error message
  code: string; // Machine-readable error code
  params?: Record<string, unknown>; // Additional validation parameters
}

/**
 * Resource error details
 * Used when an operation on a resource fails
 */
export interface ResourceError {
  resourceType: string; // Type of resource (e.g., "note", "user")
  resourceId?: string; // ID of the resource if applicable
  operation: string; // Operation that failed (e.g., "create", "update")
  reason: string; // Reason for the failure
}

/**
 * Authentication error details
 * Used for authentication-related failures
 */
export interface AuthenticationError {
  reason: string; // Reason for authentication failure
  requiresAction?: string; // Action required to resolve (e.g., "verify-email")
  accountStatus?: string; // Current account status if relevant
}

/**
 * Authorization error details
 * Used when permission checks fail
 */
export interface AuthorizationError {
  requiredPermissions?: string[]; // Permissions needed
  userPermissions?: string[]; // Permissions the user has
  resource?: string; // Resource being accessed
  action?: string; // Action being attempted
}

/**
 * Token error details
 * Used for JWT and refresh token errors
 */
export interface TokenError {
  tokenType: "access" | "refresh" | "verification"; // Type of token
  reason: string; // Reason for token error
  expiredAt?: string; // When the token expired
  issuedAt?: string; // When the token was issued
}

/**
 * Standard error response
 * This is the shape of all error responses from the API
 *
 * Example usage in frontend:
 * ```typescript
 * try {
 *   const response = await fetch('/api/notes');
 *   if (!response.ok) {
 *     const error: ErrorResponse = await response.json();
 *
 *     switch (error.error.type) {
 *       case SecurityErrorType.AUTHENTICATION:
 *         // Handle authentication error
 *         break;
 *       case SecurityErrorType.RESOURCE_NOT_FOUND:
 *         // Handle not found error
 *         break;
 *       // ... handle other cases
 *     }
 *   }
 * } catch (err) {
 *   // Handle network error
 * }
 * ```
 */
export interface ErrorResponse {
  error: {
    // Core error information
    type: SecurityErrorType; // Type of error that occurred
    message: string; // Human-readable error message
    code: number; // HTTP status code
    timestamp: string; // When the error occurred
    requestId?: string; // Request ID for tracking

    // Detailed error information
    details?: Record<string, unknown>; // Additional error details
    validationErrors?: ValidationError[]; // Validation failure details
    resourceError?: ResourceError; // Resource operation failure details
    authError?: AuthenticationError | AuthorizationError; // Auth failure details
    tokenError?: TokenError; // Token-related error details
  };
}

/**
 * Type guard to check if an error response has validation errors
 */
export function hasValidationErrors(
  error: ErrorResponse
): error is ErrorResponse & { error: { validationErrors: ValidationError[] } } {
  return Array.isArray(error.error.validationErrors);
}

/**
 * Type guard to check if an error response has a resource error
 */
export function hasResourceError(
  error: ErrorResponse
): error is ErrorResponse & { error: { resourceError: ResourceError } } {
  return error.error.resourceError !== undefined;
}

/**
 * Type guard to check if an error response has an auth error
 */
export function hasAuthError(error: ErrorResponse): error is ErrorResponse & {
  error: { authError: AuthenticationError | AuthorizationError };
} {
  return error.error.authError !== undefined;
}

/**
 * Type guard to check if an error response has a token error
 */
export function hasTokenError(
  error: ErrorResponse
): error is ErrorResponse & { error: { tokenError: TokenError } } {
  return error.error.tokenError !== undefined;
}

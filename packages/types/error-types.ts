/**
 * Security Error Types and Response Interfaces
 *
 * This module provides a comprehensive type system for handling API errors.
 * It is designed to be easily consumable by frontend applications and API clients.
 */

/**
 * Enum for different types of security/error events
 */
export enum SecurityErrorType {
  // Authentication Errors (401)
  AUTHENTICATION = "AUTHENTICATION_ERROR",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  // @todo: Implement email verification flow
  ACCOUNT_DISABLED = "ACCOUNT_DISABLED",
  EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED",

  // Authorization Errors (403)
  AUTHORIZATION = "AUTHORIZATION_ERROR",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
  RESOURCE_ACCESS_DENIED = "RESOURCE_ACCESS_DENIED",

  // Token Errors (401)
  INVALID_TOKEN = "INVALID_TOKEN",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOKEN_REVOKED = "TOKEN_REVOKED",
  TOKEN_REUSE = "TOKEN_REUSE_DETECTED",

  // CSRF Errors (403)
  CSRF = "CSRF_ERROR",
  MISSING_CSRF_TOKEN = "MISSING_CSRF_TOKEN",
  INVALID_CSRF_TOKEN = "INVALID_CSRF_TOKEN",

  // Validation Errors (422)
  VALIDATION = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",
  MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",

  // Resource Errors (404, 409)
  RESOURCE = "RESOURCE_ERROR",
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  RESOURCE_ALREADY_EXISTS = "RESOURCE_ALREADY_EXISTS",
  RESOURCE_CONFLICT = "RESOURCE_CONFLICT",

  // Server Errors (500)
  SERVER_ERROR = "SERVER_ERROR",
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

  // Resource errors -> 404/409
  [SecurityErrorType.RESOURCE]: 404,
  [SecurityErrorType.RESOURCE_NOT_FOUND]: 404,
  [SecurityErrorType.RESOURCE_ALREADY_EXISTS]: 409,
  [SecurityErrorType.RESOURCE_CONFLICT]: 409,

  // Server errors -> 500
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
  params?: {
    // Additional validation parameters
    max?: number;
    min?: number;
    current?: number;
    [key: string]: unknown; // Allow any additional parameters
  };
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
  reason: string; // Reason for authorization failure
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
 * Standard error response structure
 */
export interface ErrorDetails {
  type: SecurityErrorType; // Type of error that occurred
  message: string; // Human-readable error message
  code: number; // HTTP status code
  timestamp: string; // When the error occurred
  requestId?: string; // Request ID for tracking
  details?: Record<string, unknown>; // Additional error details
  validationErrors?: ValidationError[]; // Validation failure details
  resourceError?: ResourceError; // Resource operation failure details
  authError?: AuthenticationError | AuthorizationError; // Auth failure details
  tokenError?: TokenError; // Token-related error details
}

/**
 * API error response wrapper
 */
export interface ErrorResponse {
  error: ErrorDetails;
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

/**
 * Enum for different types of security/error events
 */
export enum SecurityErrorType {
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  INVALID_INPUT = "INVALID_INPUT",
  VALIDATION = "VALIDATION",
  RESOURCE = "RESOURCE",
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  RESOURCE_CONFLICT = "RESOURCE_CONFLICT",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  INVALID_TOKEN = "INVALID_TOKEN",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
  CSRF = "CSRF",
  MISSING_CSRF_TOKEN = "MISSING_CSRF_TOKEN",
  INVALID_CSRF_TOKEN = "INVALID_CSRF_TOKEN",
  SERVER_ERROR = "SERVER_ERROR",
}

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Resource error details
 */
export interface ResourceError {
  resourceType: string;
  operation: string;
  reason: string;
}

/**
 * Authentication error details
 */
export interface AuthenticationError {
  reason: string;
}

/**
 * Authorization error details
 */
export interface AuthorizationError {
  reason: string;
}

/**
 * Token error details
 */
export interface TokenError {
  tokenType: "access" | "refresh";
  reason: string;
}

/**
 * Standard error response structure
 */
export interface ErrorDetails {
  type: SecurityErrorType;
  message: string;
  code: number;
  timestamp: string;
  requestId?: string;
  details?: Record<string, unknown>;
  validationErrors?: ValidationError[];
  resourceError?: ResourceError;
  authError?: AuthenticationError | AuthorizationError;
  tokenError?: TokenError;
}

/**
 * API error response wrapper
 */
export interface ErrorResponse {
  error: ErrorDetails;
}

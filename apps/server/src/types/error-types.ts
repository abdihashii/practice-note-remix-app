// Security-related error types
export enum SecurityErrorType {
  AUTHENTICATION = "AUTHENTICATION_ERROR",
  AUTHORIZATION = "AUTHORIZATION_ERROR",
  INVALID_TOKEN = "INVALID_TOKEN",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  CSRF = "CSRF_ERROR",
  RATE_LIMIT = "RATE_LIMIT_ERROR",
  INVALID_INPUT = "INVALID_INPUT",
  SECURITY_POLICY = "SECURITY_POLICY_ERROR",
}

// Standard error response interface
export interface ErrorResponse {
  error: {
    type: string;
    message: string;
    code: number;
    timestamp: string;
    requestId?: string;
    details?: Record<string, unknown>;
  };
}

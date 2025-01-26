// Third-party imports
import {
  type AuthenticationError,
  type AuthorizationError,
  type ErrorResponse,
  type ResourceError,
  SecurityErrorType,
  type TokenError,
  type ValidationError,
  hasAuthError,
  hasResourceError,
  hasTokenError,
  hasValidationErrors,
} from "@notes-app/types";

// First-party imports
import { getAccessToken } from "~/lib/auth-utils";
import { API_URL } from "~/lib/constants";

// Error classes
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: ErrorResponse
  ) {
    super(message);
    this.name = "ApiError";
  }

  /**
   * Helper to check if error is of a specific type
   */
  is(...types: SecurityErrorType[]): boolean {
    return types.includes(this.data?.error.type as SecurityErrorType);
  }

  /**
   * Get validation errors if they exist
   */
  getValidationErrors(): ValidationError[] | undefined {
    return hasValidationErrors(this.data!)
      ? this.data!.error.validationErrors
      : undefined;
  }

  /**
   * Get validation error messages if they exist
   */
  getValidationMessages(): string[] {
    return this.getValidationErrors()?.map((e) => e.message) ?? [];
  }

  /**
   * Get the first validation error message or a default
   */
  getFirstValidationError(defaultMsg = "Invalid input"): string {
    return this.getValidationMessages()[0] ?? defaultMsg;
  }

  /**
   * Get resource error if it exists
   */
  getResourceError(): ResourceError | undefined {
    return hasResourceError(this.data!)
      ? this.data!.error.resourceError
      : undefined;
  }

  /**
   * Get auth error if it exists
   */
  getAuthError(): AuthenticationError | AuthorizationError | undefined {
    return hasAuthError(this.data!) ? this.data!.error.authError : undefined;
  }

  /**
   * Get token error if it exists
   */
  getTokenError(): TokenError | undefined {
    return hasTokenError(this.data!) ? this.data!.error.tokenError : undefined;
  }
}

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
  /**
   * Function to handle specific error types before throwing.
   * Return a value to prevent the error from being thrown.
   */
  handleError?: (error: ApiError) => any;
}

/**
 * API client that automatically handles auth headers and response parsing.
 * Designed to work with TanStack Query which handles retries and timeouts.
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  { requireAuth = true, handleError, ...options }: FetchOptions = {}
): Promise<T> {
  const headers = new Headers({
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  });

  // Add auth header if required and token exists
  if (requireAuth) {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new ApiError(
      data.error?.message || `API Error: ${response.status}`,
      response.status,
      data as ErrorResponse
    );

    // Allow caller to handle specific error types
    if (handleError) {
      const result = handleError(error);
      if (result !== undefined) {
        return result as T;
      }
    }

    throw error;
  }

  return data as T;
}

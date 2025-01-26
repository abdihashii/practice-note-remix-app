// Third-party imports
import type { ErrorResponse } from "@notes-app/types";

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
}

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * API client that automatically handles auth headers and response parsing.
 * Designed to work with TanStack Query which handles retries and timeouts.
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  { requireAuth = true, ...options }: FetchOptions = {}
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
    throw new ApiError(
      data.error?.message || `API Error: ${response.status}`,
      response.status,
      data as ErrorResponse
    );
  }

  return data as T;
}

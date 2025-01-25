// First-party imports
import { getAccessToken } from "~/lib/auth-utils";
import { API_URL } from "~/lib/constants";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * API client that automatically handles auth headers and response parsing
 */
export async function apiClient<T = any>(
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

  if (!response.ok) {
    // Handle specific error cases here
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

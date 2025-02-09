// Third-party imports
import type { AuthResponse, TokenResponse } from "@notes-app/types";

// First-party imports
import { refreshTokens } from "~/api/auth";
import { REFRESH_TOKEN_KEY } from "~/lib/constants";

// In-memory storage for access token (fallback when React Query is not available)
let memoryAccessToken: string | null = null;

/**
 * Store access token in memory for fallback when React Query is not available
 */
export function storeAccessTokenInMemory(tokens: AuthResponse | TokenResponse) {
  memoryAccessToken = tokens.accessToken;
}

/**
 * Get access token from memory
 */
export function getAccessToken(): string | null {
  return memoryAccessToken;
}

/**
 * Clear auth tokens from memory and cookies
 */
export function clearAuthTokens() {
  // Clear memory access token
  memoryAccessToken = null;

  // Clear refresh token cookie by setting it to expire
  if (typeof document !== "undefined") {
    // Clear both possible cookie names
    document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `__Host-${REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

/**
 * Check if user is authenticated by verifying access token presence
 * Optionally tries to refresh the token if expired
 */
export async function isAuthenticated(tryRefresh = true): Promise<boolean> {
  // Check if access token is in memory
  const accessToken = getAccessToken();
  if (accessToken) return true;

  // If no access token and refresh is allowed, try refreshing
  if (tryRefresh && typeof document !== "undefined") {
    try {
      const newTokens = await refreshTokens();
      return !!newTokens;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return false;
    }
  }

  return false;
}

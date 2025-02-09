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
 * Get refresh token from cookie
 * Works in both client and server environments
 */
export function getRefreshToken(request?: Request): string | null {
  if (typeof document !== "undefined") {
    // Client-side
    const match = document.cookie.match(
      new RegExp(`${REFRESH_TOKEN_KEY}=([^;]+)`)
    );
    return match ? match[1] : null;
  }

  // Server-side
  if (request) {
    const cookieHeader = request.headers.get("Cookie");
    if (cookieHeader) {
      const cookies = cookieHeader.split("; ").reduce((acc, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      return cookies[REFRESH_TOKEN_KEY] || null;
    }
  }

  return null;
}

/**
 * Clear auth tokens from memory and cookies
 */
export function clearAuthTokens() {
  // Clear memory access token
  memoryAccessToken = null;

  // Clear refresh token cookie
  if (typeof document !== "undefined") {
    document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

/**
 * Check if user is authenticated by verifying access token presence
 * Optionally tries to refresh the token if expired
 */
export async function isAuthenticated(
  request?: Request,
  tryRefresh = true
): Promise<boolean> {
  const accessToken = getAccessToken();

  if (accessToken) return true;

  // If no access token and refresh is allowed, try refreshing
  if (tryRefresh && typeof document !== "undefined") {
    const newTokens = await refreshTokens();
    return !!newTokens;
  }

  return false;
}

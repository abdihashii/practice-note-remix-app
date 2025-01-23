// Third-party imports
import type { AuthResponse } from "@notes-app/types";

// First-party imports
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "~/lib/constants";

/**
 * Store auth tokens in HTTP-only cookies
 */
export function storeAuthTokens(
  tokens: Pick<AuthResponse, "accessToken" | "refreshToken">
) {
  // Set access token cookie (15 minutes)
  document.cookie = `${ACCESS_TOKEN_KEY}=${tokens.accessToken}; path=/; max-age=900; SameSite=Strict; HttpOnly`;

  // Set refresh token cookie (7 days)
  document.cookie = `${REFRESH_TOKEN_KEY}=${tokens.refreshToken}; path=/; max-age=604800; SameSite=Strict; HttpOnly`;
}

/**
 * Get access token from cookie
 * Works in both client and server environments
 */
export function getAccessToken(request?: Request): string | null {
  if (typeof document !== "undefined") {
    // Client-side
    const match = document.cookie.match(
      new RegExp(`${ACCESS_TOKEN_KEY}=([^;]+)`)
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
      return cookies[ACCESS_TOKEN_KEY] || null;
    }
  }

  return null;
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
 * Clear auth tokens from cookies
 */
export function clearAuthTokens() {
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Check if user is authenticated by verifying access token presence
 * Works in both client and server environments
 */
export function isAuthenticated(request?: Request): boolean {
  return !!getAccessToken(request);
}

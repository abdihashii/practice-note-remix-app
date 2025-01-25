// Third-party imports
import type { AuthResponse, User } from "@notes-app/types";

// First-party imports
import {
  clearAuthTokens,
  getRefreshToken,
  storeAuthTokens,
} from "~/lib/auth-utils";
import { apiClient } from "~/lib/api-client";

/**
 * Login user with email and password
 */
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const data = await apiClient<AuthResponse>("/auth/login", {
    method: "POST",
    requireAuth: false,
    body: JSON.stringify({ email, password }),
  });

  return data;
};

/**
 * Logout user and invalidate tokens
 */
export const logout = async (): Promise<void> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return;

  try {
    await apiClient("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  } finally {
    // Clear tokens even if server request fails
    await clearAuthTokens();
  }
};

/**
 * Refresh the access token using the refresh token
 * Returns the new tokens if successful, null if failed
 */
export const refreshTokens = async (): Promise<Pick<
  AuthResponse,
  "accessToken" | "refreshToken"
> | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const data = await apiClient<
      Pick<AuthResponse, "accessToken" | "refreshToken">
    >("/auth/refresh", {
      method: "POST",
      requireAuth: false,
      body: JSON.stringify({ refreshToken }),
    });

    storeAuthTokens(data);
    return data;
  } catch (error) {
    console.error("Failed to refresh tokens:", error);
    await clearAuthTokens();
    return null;
  }
};

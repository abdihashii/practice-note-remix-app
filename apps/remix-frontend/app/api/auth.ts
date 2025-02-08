// Third-party imports
import { SecurityErrorType, type AuthResponse } from "@notes-app/types";

// First-party imports
import { apiClient } from "~/lib/api-client";
import { APIError } from "~/lib/api-error";
import {
  clearAuthTokens,
  getRefreshToken,
  storeAuthTokens,
} from "~/lib/auth-utils";

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
    handleError: (error) => {
      if (!error.data) {
        throw new Error("Unexpected error response format");
      }
      // Convert error response to APIError
      const apiError = new APIError(error.data);
      console.error("Login failed:", apiError.getTechnicalDetails());
      throw apiError;
    },
  });

  storeAuthTokens(data);
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
    clearAuthTokens();
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

  const data = await apiClient<
    Pick<AuthResponse, "accessToken" | "refreshToken">
  >("/auth/refresh", {
    method: "POST",
    requireAuth: false,
    body: JSON.stringify({ refreshToken }),
    handleError: (error) => {
      if (
        error.is(
          SecurityErrorType.TOKEN_EXPIRED,
          SecurityErrorType.INVALID_TOKEN
        )
      ) {
        clearAuthTokens();
        return null;
      }
    },
  });

  if (data) {
    storeAuthTokens(data);
  }
  return data;
};

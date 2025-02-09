// Third-party imports
import { type User } from "@notes-app/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// First-party imports
import { refreshTokens } from "~/api/auth";
import { apiClient } from "~/lib/api-client";
import {
  clearAuthTokens,
  getAccessToken,
  storeAccessTokenInMemory,
} from "~/lib/auth-utils";

const AUTH_QUERY_KEY = ["auth"] as const;

type AuthState = {
  accessToken: string | null;
  user: User | null;
};

async function initAuth(): Promise<AuthState> {
  debugger;
  // First try to get existing access token from memory
  let accessToken = getAccessToken();

  // If no access token, try to refresh using the httpOnly cookie
  // The cookie will be sent automatically with the request
  if (!accessToken) {
    try {
      const tokens = await refreshTokens();
      if (tokens) {
        accessToken = tokens.accessToken;
        // Store the new access token in memory
        storeAccessTokenInMemory(tokens);
      }
    } catch (error) {
      console.error("[initAuth] Failed to refresh token:", error);
      return { accessToken: null, user: null };
    }
  }

  // If we have an access token, fetch user data
  if (accessToken) {
    try {
      // Let apiClient handle the auth header
      const user = await apiClient<User>("/auth/me");
      return { accessToken, user };
    } catch (error) {
      console.error("[initAuth] Failed to fetch user data:", error);

      // If user fetch fails, clear the token and try refresh one more time
      clearAuthTokens();

      try {
        const tokens = await refreshTokens();
        if (tokens) {
          accessToken = tokens.accessToken;
          storeAccessTokenInMemory(tokens);

          // Let apiClient handle the auth header
          const user = await apiClient<User>("/auth/me");

          return { accessToken, user };
        }
      } catch (retryError) {
        console.error(
          "[initAuth] Failed to refresh token on retry:",
          retryError
        );
      }
      return { accessToken: null, user: null };
    }
  }

  console.log("[initAuth] No access token available after all attempts");
  // If all else fails, return null state
  return { accessToken: null, user: null };
}

export function useAuthStore() {
  const queryClient = useQueryClient();

  const { data: auth, isLoading } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: initAuth,
    // Don't refetch on window focus since we manage token refresh separately
    refetchOnWindowFocus: false,
    // Retry failed initialization
    retry: 1,
    // Ensure this query runs before others
    staleTime: Infinity,
  });

  const setAuth = (accessToken: string, user: User) => {
    queryClient.setQueryData(AUTH_QUERY_KEY, { accessToken, user });
    queryClient.setQueryData(["user"], user);
  };

  const clearAuth = () => {
    queryClient.setQueryData(AUTH_QUERY_KEY, { accessToken: null, user: null });
    queryClient.setQueryData(["user"], null);
  };

  return {
    accessToken: auth?.accessToken ?? null,
    user: auth?.user ?? null,
    isLoading,
    setAuth,
    clearAuth,
  };
}

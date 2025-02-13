// React
import { createContext, useContext, type ReactNode } from "react";

// Third-party imports
import { type User } from "@notes-app/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// First-party imports
import { refreshTokens } from "~/api/auth-apis";
import { apiClient } from "~/lib/api-client";
import {
  clearAuthTokensFallback,
  getAccessToken,
  storeAccessTokenInMemory,
} from "~/lib/auth-utils";
import { AUTH_QUERY_KEY } from "~/lib/constants";

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isPending: boolean;
  isAuthenticated: boolean;
  setAuth: (accessToken: string, user: User) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

async function initAuth(): Promise<
  Omit<AuthState, "isPending" | "setAuth" | "clearAuth">
> {
  // First try to get existing access token from memory
  let accessToken = getAccessToken();

  // If no access token, try to refresh using the httpOnly cookie
  // The cookie will be sent automatically with the request
  if (!accessToken) {
    try {
      const tokens = await refreshTokens();
      if (tokens) {
        accessToken = tokens.accessToken;
        storeAccessTokenInMemory(tokens);
      }
    } catch (error) {
      console.error("[initAuth] Failed to refresh token:", error);
      return { accessToken: null, user: null, isAuthenticated: false };
    }
  }

  // If we have an access token, fetch user data
  if (accessToken) {
    try {
      // Let apiClient handle the auth header
      const user = await apiClient<User>("/auth/me");
      return { accessToken, user, isAuthenticated: true };
    } catch (error) {
      console.error("[initAuth] Failed to fetch user data:", error);

      // If user fetch fails, clear the token from memory and try refresh
      // one more time
      clearAuthTokensFallback();

      try {
        const tokens = await refreshTokens();
        if (tokens) {
          accessToken = tokens.accessToken;
          storeAccessTokenInMemory(tokens);

          // Let apiClient handle the auth header
          const user = await apiClient<User>("/auth/me");

          return { accessToken, user, isAuthenticated: true };
        }
      } catch (retryError) {
        console.error(
          "[initAuth] Failed to refresh token on retry:",
          retryError
        );
      }
      return { accessToken: null, user: null, isAuthenticated: false };
    }
  }

  // If all else fails, return null state
  console.log("[initAuth] No access token available after all attempts");
  return { accessToken: null, user: null, isAuthenticated: false };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: auth, isPending } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: initAuth,
    // Don't refetch on window focus since we manage token refresh separately
    refetchOnWindowFocus: false,
    retry: 1,
    // Ensure this query runs before others
    staleTime: Infinity,
  });

  const setAuth = (accessToken: string, user: User) => {
    // Only update the auth state in one place to prevent sync issues
    queryClient.setQueryData(AUTH_QUERY_KEY, {
      accessToken,
      user,
      isAuthenticated: true,
    });
  };

  const clearAuth = () => {
    // Only update the auth state in one place to prevent sync issues
    queryClient.setQueryData(AUTH_QUERY_KEY, {
      accessToken: null,
      user: null,
      isAuthenticated: false,
    });
  };

  const value: AuthState = {
    accessToken: auth?.accessToken ?? null,
    user: auth?.user ?? null,
    isPending,
    isAuthenticated: !!auth?.user && !!auth?.accessToken,
    setAuth,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthStore(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthStore must be used within an AuthProvider");
  }
  return context;
}

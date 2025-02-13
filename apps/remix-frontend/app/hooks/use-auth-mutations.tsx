// React
import { useNavigate } from "react-router";

// Third-party imports
import type { AuthResponse } from "@notes-app/types";
import { SecurityErrorType } from "@notes-app/types";
import { useMutation } from "@tanstack/react-query";

// First-party imports
import { login, logout } from "~/api/auth-apis";
import { APIError } from "~/lib/api-error";
import { useAuthStore } from "~/providers/AuthProvider";

export const useAuthMutations = () => {
  const navigate = useNavigate();
  const { setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation<
    AuthResponse,
    APIError,
    { email: string; password: string }
  >({
    mutationKey: ["login"],
    mutationFn: async (data) => {
      try {
        return await login(data.email, data.password);
      } catch (error) {
        // If it's already an APIError, rethrow it
        if (error instanceof APIError) throw error;

        // Convert unknown errors to APIError
        if (error instanceof Error) {
          if (
            error.message.includes("Failed to fetch") ||
            error.message.includes("Network")
          ) {
            throw new APIError({
              error: {
                type: SecurityErrorType.SERVER_ERROR,
                message:
                  "Unable to connect to the server. Please check your internet connection.",
                code: 0,
                timestamp: new Date().toISOString(),
                details: { originalError: error.message },
              },
            });
          }
        }

        // For any other unknown error
        throw new APIError({
          error: {
            type: SecurityErrorType.SERVER_ERROR,
            message: "An unexpected error occurred. Please try again.",
            code: 500,
            timestamp: new Date().toISOString(),
            details: {
              originalError:
                error instanceof Error ? error.message : "Unknown error",
            },
          },
        });
      }
    },
    onSuccess: (data) => {
      // Update auth store with new tokens and user
      setAuth(data.accessToken, data.user);

      // Get the return URL from query params or default to /notes
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo") || "/notes";
      navigate(returnTo, { replace: true });
    },
    onError: (error) => {
      // Log technical details for debugging
      console.error("Authentication error:", error.getTechnicalDetails());
    },
    // Add retry logic only for network errors
    retry: (failureCount, error) => {
      return error.code === 0 && failureCount < 3;
    },
  });

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      try {
        await logout();
      } catch (error) {
        // Ignore errors during logout - we want to clear auth state anyway
        console.error("Logout error:", error);
      }
      // Always clear auth state, even if the API call fails
      clearAuth();
    },
    onSuccess: () => {
      navigate("/login", { replace: true });
    },
  });

  return {
    loginMutation,
    // Expose the user-friendly error message
    loginError: loginMutation.error?.getUserMessage(),
    logoutMutation,
    logoutMutationPending: logoutMutation.isPending,
  };
};

// React
import { useNavigate } from "react-router";

// Third-party imports
import type { AuthResponse } from "@notes-app/types";
import { useMutation } from "@tanstack/react-query";

// First-party imports
import { login, logout } from "~/api/auth";
import { useAuthStore } from "~/hooks/use-auth-store";
import type { APIError } from "~/lib/api-error";

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    setAuth,
    clearAuth,
    user,
    accessToken,
    isPending: isAuthQueryPending,
  } = useAuthStore();

  const loginMutation = useMutation<
    AuthResponse,
    APIError,
    { email: string; password: string }
  >({
    mutationKey: ["login"],
    mutationFn: (data) => login(data.email, data.password),
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
      // Error message is already user-friendly from APIError
    },
  });

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      navigate("/login", { replace: true });
    },
  });

  return {
    user,
    isAuthenticated: !!user && !!accessToken,
    isAuthQueryPending,
    loginMutation,
    // Expose the user-friendly error message
    loginError: loginMutation.error?.getUserMessage(),
    logoutMutation,
    logoutMutationPending: logoutMutation.isPending,
  };
};

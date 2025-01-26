// Third-party imports
import type { AuthResponse } from "@notes-app/types";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

// First-party imports
import { login } from "~/api/auth";
import { storeAuthTokens } from "~/lib/auth-utils";

export const useAuth = () => {
  const navigate = useNavigate();

  const loginMutation = useMutation<
    AuthResponse,
    Error,
    { email: string; password: string }
  >({
    mutationKey: ["user"],
    mutationFn: (data) => login(data.email, data.password),
    onSuccess: (data) => {
      // Tokens go to secure cookies
      storeAuthTokens({
        refreshToken: data.refreshToken,
        accessToken: data.accessToken,
      });

      // User data can stay in query cache
      // Get the return URL from query params or default to /notes
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo") || "/notes";
      navigate(returnTo);
    },
  });

  return { loginData: loginMutation.data, loginMutation };
};

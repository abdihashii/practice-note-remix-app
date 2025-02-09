// React
import { useState } from "react";

// First-party imports
import { useAuth } from "./use-auth";

export default function useLoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { loginMutation, loginError, isAuthenticated, isAuthQueryPending } =
    useAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    loginMutation.mutate({
      email,
      password,
    });
  };

  return {
    loginMutation,
    loginError,
    isAuthenticated,
    isAuthQueryPending,
    handleSubmit,
    showPassword,
    setShowPassword,
  };
}

// React
import { useState } from "react";

// Third-party imports
import { useForm } from "react-hook-form";

// First-party imports
import { useAuth } from "./use-auth";

// Types
type LoginFormData = {
  email: string;
  password: string;
};

export default function useLoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { loginMutation, loginError, isAuthenticated, isAuthQueryPending } =
    useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    loginMutation,
    loginError,
    isAuthenticated,
    isAuthQueryPending,
    showPassword,
    setShowPassword,
  };
}

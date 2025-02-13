// React
import { useState } from "react";

// Third-party imports
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// First-party imports
import { useAuthMutations } from "./use-auth-mutations";

// Schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// Types
type LoginFormData = z.infer<typeof loginSchema>;

export default function useLoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { loginMutation, loginError, isAuthenticated, isAuthQueryPending } =
    useAuthMutations();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
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

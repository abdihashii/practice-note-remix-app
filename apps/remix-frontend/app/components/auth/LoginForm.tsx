// Third-party imports
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

// First-party imports
import useLoginForm from "~/hooks/use-login-form";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    errors,
    loginMutation,
    loginError,
    showPassword,
    setShowPassword,
  } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 items-start">
        <Label htmlFor="email">Email</Label>
        <Input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          type="email"
          id="email"
          disabled={loginMutation.isPending}
        />
        {errors.email && (
          <p className="text-red-500 text-sm" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2 items-start">
        <Label htmlFor="password">Password</Label>
        <div className="relative w-full">
          <Input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type={showPassword ? "text" : "password"}
            id="password"
            disabled={loginMutation.isPending}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? (
              <EyeOffIcon className="w-4 h-4" />
            ) : (
              <EyeIcon className="w-4 h-4" />
            )}
          </span>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </Button>
      {loginError && (
        <p className="text-red-500 text-sm mt-2" role="alert">
          {loginError}
        </p>
      )}
    </form>
  );
}

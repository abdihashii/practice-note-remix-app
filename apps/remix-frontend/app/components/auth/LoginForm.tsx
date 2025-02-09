// Third-party imports
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

// First-party imports
import useLoginForm from "~/hooks/use-login-form";

export default function LoginForm() {
  const { loginMutation, loginError, handleSubmit } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 items-start">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          disabled={loginMutation.isPending}
          required
        />
      </div>
      <div className="flex flex-col gap-2 items-start">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          name="password"
          disabled={loginMutation.isPending}
          required
        />
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

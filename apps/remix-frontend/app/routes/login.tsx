// React
import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/login";

// Third-party imports
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

// First-party imports
import { useAuth } from "~/hooks/use-auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login to Notes App" },
    {
      name: "description",
      content: "Login to your Notes App account",
    },
  ];
}

export default function Login() {
  const navigate = useNavigate();
  const { loginMutation, loginError, isAuthenticated, isAuthQueryPending } =
    useAuth();

  // Redirect to notes if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo") || "/notes";
      navigate(returnTo, { replace: true });
    }
  }, [isAuthenticated, navigate]);

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

  // Show nothing while checking auth state or if authenticated
  if (isAuthQueryPending || isAuthenticated) {
    return (
      <main className="flex h-screen w-full items-center justify-center px-4 sm:px-6 lg:px-8">
        <Loader2 className="w-10 h-10 animate-spin" />
      </main>
    );
  }

  return (
    <main className="flex h-screen w-full items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">
          Login to Notes App
        </h1>
        <p className="mb-8 text-lg text-muted-foreground sm:text-xl md:text-2xl">
          Login to your Notes App account
        </p>

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
      </div>
    </main>
  );
}

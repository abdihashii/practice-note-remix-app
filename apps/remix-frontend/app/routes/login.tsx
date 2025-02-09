// React
import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/login";

// Third-party imports
import { Loader2 } from "lucide-react";

// First-party imports
import LoginForm from "~/components/auth/LoginForm";
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
  const { isAuthenticated, isAuthQueryPending } = useAuth();

  // Redirect to notes if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo") || "/notes";
      navigate(returnTo, { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
          Log in to Notes App
        </h1>
        <p className="mb-8 text-lg text-muted-foreground sm:text-xl md:text-2xl">
          Log in to your Notes App account
        </p>

        <LoginForm />
      </div>
    </main>
  );
}

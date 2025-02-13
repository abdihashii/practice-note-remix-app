// React
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

// Third-party imports
import { Loader2 } from "lucide-react";
import Header from "~/components/layout/Header";
import { Toaster } from "~/components/ui/toaster";

// First-party imports
import { useAuthStore } from "~/providers/AuthProvider";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isPending: isAuthQueryPending } = useAuthStore();

  useEffect(() => {
    if (!isAuthQueryPending && !isAuthenticated) {
      const params = new URLSearchParams({
        returnTo: location.pathname,
      });
      navigate(`/login?${params.toString()}`, { replace: true });
    }
  }, [isAuthQueryPending, isAuthenticated, location.pathname, navigate]);

  // Show loading spinner during auth check OR when about to redirect
  // This prevents the page from flashing when the user is redirected to login
  if (isAuthQueryPending || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return children;
}

export default function NotesLayout() {
  return (
    <RequireAuth>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-grow flex-col">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
        <Toaster />
      </div>
    </RequireAuth>
  );
}

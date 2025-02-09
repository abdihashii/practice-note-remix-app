// React
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

// Third-party imports
import { Loader2 } from "lucide-react";
import Header from "~/components/layout/Header";
import { Toaster } from "~/components/ui/toaster";

// First-party imports
import { useAuth } from "~/hooks/use-auth";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAuthQueryPending } = useAuth();

  useEffect(() => {
    if (!isAuthQueryPending && !isAuthenticated) {
      const params = new URLSearchParams({
        returnTo: location.pathname,
      });
      navigate(`/login?${params.toString()}`, { replace: true });
    }
  }, [isAuthQueryPending, isAuthenticated, location.pathname, navigate]);

  if (isAuthQueryPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}

export default function NotesLayout() {
  console.log("NotesLayout");
  console.log(process.env.NODE_ENV);

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

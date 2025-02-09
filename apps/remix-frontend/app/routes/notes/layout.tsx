// React
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

// Third-party imports
import Header from "~/components/layout/Header";
import { Toaster } from "~/components/ui/toaster";

// First-party imports
import { isAuthenticated } from "~/lib/auth-utils";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    isAuthenticated()
      .then((authed) => {
        setIsAuthed(authed);
        setAuthChecked(true);
      })
      .catch(() => {
        setIsAuthed(false);
        setAuthChecked(true);
      });
  }, []);

  useEffect(() => {
    if (!isAuthed) {
      const params = new URLSearchParams({
        returnTo: location.pathname,
      });
      navigate(`/login?${params.toString()}`, { replace: true });
    }
  }, [isAuthed, location.pathname, navigate]);

  // Don't render anything while checking auth
  if (!authChecked) {
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

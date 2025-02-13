// React
import { Link } from "react-router";

// Third-party imports
import { Loader2, LogOut } from "lucide-react";
import { Button } from "~/components/ui/button";

// First-party imports
import { useAuthMutations } from "~/hooks/use-auth-mutations";

// First party components
// import DarkModeToggleButton from "@/components/common/DarkModeToggleButton";

const Header = () => {
  const { logoutMutation, logoutMutationPending } = useAuthMutations();

  return (
    <header className="sticky top-0 z-10 border-b border-foreground/10 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between sm:h-16 md:h-20">
          <Link
            to="/notes"
            className="truncate text-lg font-bold text-foreground hover:text-foreground/80 sm:text-xl md:text-2xl"
          >
            My Notes
          </Link>

          {/* <DarkModeToggleButton /> */}
          <Button
            className="w-28"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutationPending}
          >
            {logoutMutationPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Logout
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

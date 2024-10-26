// First party components
import { Link } from "@remix-run/react";

// First party components
import DarkModeToggleButton from "~/components/common/layout/DarkModeToggleButton";

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          <Link
            to="/notes"
            className="text-lg sm:text-xl md:text-2xl font-bold text-foreground hover:text-foreground/80 truncate"
          >
            My Notes
          </Link>

          <DarkModeToggleButton />
        </div>
      </div>
    </header>
  );
};

export default Header;

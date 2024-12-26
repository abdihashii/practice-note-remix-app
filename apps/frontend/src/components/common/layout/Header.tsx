// First party components
import Link from "next/link";

// First party components
import DarkModeToggleButton from "@/components/common/DarkModeToggleButton";

const Header = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-foreground/10 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between sm:h-16 md:h-20">
          <Link
            href="/notes"
            className="truncate text-lg font-bold text-foreground hover:text-foreground/80 sm:text-xl md:text-2xl"
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

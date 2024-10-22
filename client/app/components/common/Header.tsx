// Third party libraries
import { Theme, useTheme } from "remix-themes";

// Third party components
import { MoonIcon, SunIcon } from "lucide-react";

// First party components
import { Button } from "~/components/ui/button";

const Header = () => {
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  return (
    <header className="sticky top-0 z-10 bg-background shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">
            My Notes
          </h1>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 sm:h-9 sm:w-9"
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
            >
              {theme === "light" ? (
                <MoonIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <SunIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

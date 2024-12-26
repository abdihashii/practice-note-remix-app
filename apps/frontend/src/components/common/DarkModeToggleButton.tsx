// Third party libraries
import { Theme, useTheme } from "remix-themes";

// Third party components
import { MoonIcon, SunIcon } from "lucide-react";

// First party components
import { Button } from "@/components/ui/button";

export default function DarkModeToggleButton() {
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="h-8 w-8 rounded-full hover:bg-foreground/10 sm:h-9 sm:w-9"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? (
          <MoonIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <SunIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        )}
      </Button>
    </div>
  );
}

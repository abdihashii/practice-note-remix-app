import { useState } from "react";

import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "~/components/ui/button";

const Header = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white shadow">
      <h1 className="text-2xl font-bold">My Notes</h1>

      <div>
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === "light" ? (
            <MoonIcon className="w-4 h-4" />
          ) : (
            <SunIcon className="w-4 h-4" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;

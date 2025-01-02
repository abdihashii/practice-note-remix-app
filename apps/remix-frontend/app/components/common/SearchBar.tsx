// React
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

// Third-party imports
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { ChevronUp, Command, Search } from "lucide-react";

interface SearchBarProps {
  defaultQuery: string;
}

export default function SearchBar({ defaultQuery }: SearchBarProps) {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    // Check if user is on macOS
    setIsMac(navigator.platform.toLowerCase().includes("mac"));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = formData.get("q") as string;

    const params = new URLSearchParams();
    if (value) {
      params.set("q", value);
    }
    navigate(`/notes${value ? `?${params.toString()}` : ""}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        ref={searchInputRef}
        type="search"
        name="q"
        placeholder="Search notes..."
        className={cn(
          "pl-9 pr-20 transition-all duration-200",
          "focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:ring-offset-background"
        )}
        defaultValue={defaultQuery}
      />
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded border bg-muted px-1.5 py-0.5">
        {isMac ? (
          <Command className="h-3 w-3 text-muted-foreground/70" />
        ) : (
          <ChevronUp className="h-3 w-3 text-muted-foreground/70" />
        )}
        <span className="text-xs font-medium text-muted-foreground/70">K</span>
      </div>
    </form>
  );
}

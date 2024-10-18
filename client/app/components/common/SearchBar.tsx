// React
import { FormEvent, useEffect, useRef } from "react";

// Third party components
import { Input } from "~/components/ui/input";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  onSearch,
}: {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  onSearch: (searchQuery: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Effect to focus the input when user hits the '/' key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 h-12"
    >
      <Input
        ref={inputRef}
        name="q"
        placeholder="Type / to search notes"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-full"
        autoComplete="off"
      />
    </form>
  );
};

export default SearchBar;

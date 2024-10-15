// React
import { FormEvent, useEffect, useRef, useState } from "react";

// Third party components
import { AlertCircleIcon, Loader2Icon, SearchIcon } from "lucide-react";
import { Input } from "~/components/ui/input";

// First party components
import { useSearch } from "~/hooks/useSearch";

interface SearchBarProps<T> {
  queryKey: string;
  searchFn: (query: string) => Promise<T[]>;
  placeholder?: string;
  onResultsChange?: (results: T[] | undefined) => void;
}

export function SearchBar<T>({
  queryKey,
  searchFn,
  placeholder = "Search...",
  onResultsChange,
}: SearchBarProps<T>) {
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const {
    searchQuery,
    setSearchQuery,
    submitSearch,
    data,
    isLoading,
    isError,
  } = useSearch({
    queryKey,
    searchFn,
  });

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "/" && !isFocused) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isFocused]);

  useEffect(() => {
    if (onResultsChange) {
      onResultsChange(data);
    }
  }, [data, onResultsChange]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitSearch();
  };

  return (
    <form className="w-full relative h-12" onSubmit={handleSubmit}>
      <SearchIcon
        className={`h-4 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-colors ${
          isFocused ? "text-gray-700" : "text-gray-400"
        }`}
      />
      <Input
        type="text"
        name="search-query"
        placeholder={placeholder}
        className="pl-12 w-full h-full pr-10 focus:border-gray-400 focus:ring-gray-300"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        ref={inputRef}
        autoFocus
        autoComplete="off"
      />
      {isLoading ? (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Loader2Icon className="animate-spin h-5 w-5 text-gray-400" />
        </div>
      ) : isError ? (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <AlertCircleIcon className="h-5 w-5 text-red-500" />
        </div>
      ) : (
        <div
          className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none h-7 w-7 flex items-center justify-center border border-gray-200 rounded-md transition-colors ${
            isFocused ? "text-gray-700" : "text-gray-400"
          }`}
        >
          /
        </div>
      )}
    </form>
  );
}

// React
import { FormEvent } from "react";

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
        type="search"
        name="q"
        placeholder="Type / to search notes"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-full"
        autoFocus
        autoComplete="off"
      />
    </form>
  );
};

export default SearchBar;

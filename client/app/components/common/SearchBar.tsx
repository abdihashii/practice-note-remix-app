// Remix and React
import { Form, useSubmit } from "@remix-run/react";
import { useState } from "react";

// Third party components
import { SearchIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const submit = useSubmit();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit(event.currentTarget);
  };

  return (
    <Form
      method="get"
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm items-center space-x-2"
    >
      <Input
        type="search"
        name="q"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button type="submit" size="icon">
        <SearchIcon className="h-4 w-4" />
      </Button>
    </Form>
  );
};

export default SearchBar;

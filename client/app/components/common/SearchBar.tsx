// Remix and React
import { Form, useSubmit } from "@remix-run/react";
import { useState } from "react";

// Third party components
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
      className="flex w-full items-center gap-2 h-12"
    >
      <Input
        type="search"
        name="q"
        placeholder="Type / to search notes"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-full"
      />
    </Form>
  );
};

export default SearchBar;

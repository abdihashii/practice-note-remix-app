import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface UseSearchProps<T> {
  queryKey: string;
  searchFn: (query: string) => Promise<T>;
}

export function useSearch<T>({ queryKey, searchFn }: UseSearchProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKey, submittedSearchQuery],
    queryFn: () => searchFn(submittedSearchQuery),
    enabled: !!submittedSearchQuery, // Only run the query if there's a submitted search query
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const submitSearch = () => {
    if (searchQuery.trim()) {
      setSubmittedSearchQuery(searchQuery);
    } else {
      setSubmittedSearchQuery(""); // Clear the submitted query if the search is empty
    }
  };

  return {
    searchQuery,
    setSearchQuery: handleSearch,
    submitSearch,
    data,
    isLoading,
    isError,
  };
}

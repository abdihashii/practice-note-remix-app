import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface UseSearchProps<T> {
  queryKey: string;
  searchFn: (query: string) => Promise<T>;
  enabled?: boolean;
}

export function useSearch<T>({
  queryKey,
  searchFn,
  enabled = true,
}: UseSearchProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKey, submittedSearchQuery],
    queryFn: () => searchFn(submittedSearchQuery),
    enabled: enabled,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const submitSearch = () => {
    setSubmittedSearchQuery(searchQuery);
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

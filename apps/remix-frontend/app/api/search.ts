// Third-party imports
import type { Note } from "@notes-app/types";

// Local imports
import { API_URL } from "~/lib/constants";

interface SearchResponse {
  error: string | null;
  results: Note[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const searchNotes = async (searchQuery: string) => {
  const resp = await fetch(`${API_URL}/search?q=${searchQuery}`);

  if (!resp.ok) {
    throw new Error(`Search failed with status: ${resp.status}`);
  }

  const { error, results, pagination }: SearchResponse = await resp.json();

  if (error) {
    throw new Error(error);
  }

  return {
    searchResults: results,
    pagination,
  };
};

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

export interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
}

export const searchNotes = async ({
  query,
  page = 1,
  limit = 10,
}: SearchParams) => {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    limit: limit.toString(),
  });

  const resp = await fetch(`${API_URL}/search?${params.toString()}`);

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

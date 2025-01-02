// Third-party imports
import type { Note, PaginatedResponse, SearchParams } from "@notes-app/types";

// Local imports
import { API_URL } from "~/lib/constants";

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

  const { error, results, pagination }: PaginatedResponse<Note> =
    await resp.json();

  if (error) {
    throw new Error(error);
  }

  return {
    searchResults: results,
    pagination,
  };
};

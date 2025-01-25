// Third-party imports
import type { Note, PaginatedResponse, SearchParams } from "@notes-app/types";

// Local imports
import { apiClient } from "~/lib/api-client";

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

  const data = await apiClient<PaginatedResponse<Note>>(
    `/search?${params.toString()}`
  );

  if (data.error) {
    throw new Error(data.error);
  }

  return {
    searchResults: data.results,
    pagination: data.pagination,
  };
};

// Third-party imports
import type { Note, PaginatedResponse, SearchParams } from "@notes-app/types";
import { SecurityErrorType } from "@notes-app/types";

// Local imports
import { apiClient } from "~/lib/api-client";

/**
 * Search notes with pagination
 */
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
    `/search?${params.toString()}`,
    {
      handleError: (error) => {
        if (error.is(SecurityErrorType.VALIDATION)) {
          return {
            searchResults: [],
            pagination: {
              page: 1,
              limit: 0,
              total: 0,
              totalPages: 0,
            },
          };
        }
      },
    }
  );

  return {
    searchResults: data.results,
    pagination: data.pagination,
  };
};

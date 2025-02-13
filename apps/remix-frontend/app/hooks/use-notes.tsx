// Third-party imports
import type { Note } from "@notes-app/types";
import { useQuery } from "@tanstack/react-query";

// First-party imports
import { getNotes } from "~/api/notes-apis";
import { searchNotes } from "~/api/search-apis";

interface NotesData {
  searchResults: Note[];
  pagination: {
    page: number;
    totalPages: number;
  };
}

interface UseNotesOptions {
  searchQuery: string;
  currentPage: number;
  itemsPerPage?: number;
  enabled?: boolean;
}

/**
 * Hook for fetching and managing notes data with search and pagination support.
 *
 * Features:
 * - Fetches paginated notes data
 * - Supports searching notes with a query string
 * - Handles loading and error states automatically
 * - Configurable items per page
 *
 * @param options Configuration options for the hook
 * @returns Query result containing notes data, loading state, and error state
 */
export function useNotes({
  searchQuery,
  currentPage,
  itemsPerPage = 10,
  enabled = true,
}: UseNotesOptions) {
  return useQuery<NotesData>({
    queryKey: ["notes", searchQuery, currentPage],
    queryFn: () =>
      searchQuery
        ? searchNotes({
            query: searchQuery,
            page: currentPage,
            limit: itemsPerPage,
          })
        : getNotes({
            page: currentPage,
            limit: itemsPerPage,
          }),
    enabled,
  });
}

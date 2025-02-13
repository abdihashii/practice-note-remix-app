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

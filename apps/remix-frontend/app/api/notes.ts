// Third party libraries
import type {
  CreateNoteDto,
  Note,
  PaginatedResponse,
  PaginationParams,
  UpdateNoteDto,
} from "@notes-app/types";
import { SecurityErrorType } from "@notes-app/types";

// Local imports
import { apiClient } from "~/lib/api-client";

/**
 * Get paginated notes
 */
export const getNotes = async ({
  page = 1,
  limit = 10,
}: PaginationParams = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const data = await apiClient<Note[] | PaginatedResponse<Note>>(
    `/notes?${params.toString()}`,
    {
      handleError: (error) => {
        if (error.is(SecurityErrorType.RESOURCE_NOT_FOUND)) {
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

  // Handle array response (non-paginated)
  if (Array.isArray(data)) {
    return {
      searchResults: data,
      pagination: {
        page: 1,
        limit: data.length,
        total: data.length,
        totalPages: 1,
      },
    };
  }

  return {
    searchResults: data.results,
    pagination: data.pagination,
  };
};

/**
 * Get a note by ID
 */
export const getNoteById = async (id: string): Promise<Note> => {
  return apiClient<Note>(`/notes/${id}`);
};

/**
 * Create a new note
 */
export const createNote = async (note: CreateNoteDto): Promise<Note> => {
  return apiClient<Note>("/notes", {
    method: "POST",
    body: JSON.stringify(note),
  });
};

/**
 * Update an existing note
 */
export const updateNote = async (
  id: string,
  note: UpdateNoteDto
): Promise<Note> => {
  return apiClient<Note>(`/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(note),
  });
};

/**
 * Delete a note
 */
export const deleteNote = async (id: string): Promise<Note> => {
  return apiClient<Note>(`/notes/${id}`, {
    method: "DELETE",
  });
};

/**
 * Toggle a note's favorite status
 */
export const toggleNoteFavorite = async (id: string): Promise<Note> => {
  return apiClient<Note>(`/notes/${id}/favorite`, {
    method: "PATCH",
  });
};

// Third party libraries
import type {
  CreateNoteDto,
  Note,
  PaginatedResponse,
  PaginationParams,
  UpdateNoteDto,
} from "@notes-app/types";

// Local imports
import { apiClient } from "~/lib/api-client";

export const getNotes = async ({
  page = 1,
  limit = 10,
}: PaginationParams = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const data = await apiClient<Note[] | PaginatedResponse<Note>>(
    `/notes?${params.toString()}`
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

  // Handle paginated response
  const { error, results, pagination } = data;

  if (error) {
    throw new Error(error);
  }

  return {
    searchResults: results,
    pagination,
  };
};

export const getNoteById = async (id: string): Promise<Note> => {
  return apiClient<Note>(`/notes/${id}`);
};

export const createNote = async (note: CreateNoteDto): Promise<Note> => {
  return apiClient<Note>("/notes", {
    method: "POST",
    body: JSON.stringify(note),
  });
};

export const updateNote = async (
  id: string,
  note: UpdateNoteDto
): Promise<Note> => {
  return apiClient<Note>(`/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(note),
  });
};

export const deleteNote = async (id: string): Promise<Note> => {
  return apiClient<Note>(`/notes/${id}`, {
    method: "DELETE",
  });
};

export const toggleNoteFavorite = async (id: string): Promise<Note> => {
  return apiClient<Note>(`/notes/${id}/favorite`, {
    method: "PATCH",
  });
};

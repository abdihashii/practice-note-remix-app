// Third party libraries
import type { CreateNoteDto, Note, UpdateNoteDto } from "@notes-app/types";

// Local imports
import { API_URL } from "~/lib/constants";

export interface GetNotesParams {
  page?: number;
  limit?: number;
}

interface GetNotesResponse {
  error: string | null;
  results: Note[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getNotes = async ({
  page = 1,
  limit = 10,
}: GetNotesParams = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const resp = await fetch(`${API_URL}/notes?${params.toString()}`);

  if (!resp.ok) {
    throw new Error(`Failed to fetch notes: ${resp.status}`);
  }

  const data = await resp.json();

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
  const { error, results, pagination } = data as GetNotesResponse;

  if (error) {
    throw new Error(error);
  }

  return {
    searchResults: results,
    pagination,
  };
};

export const getNoteById = async (id: string): Promise<Note | null> => {
  try {
    const response = await fetch(`${API_URL}/notes/${id}`);
    const data = await response.json();
    return data as Note;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createNote = async (note: CreateNoteDto): Promise<Note | null> => {
  try {
    const response = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });
    const data = await response.json();
    return data as Note;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateNote = async (
  id: string,
  note: UpdateNoteDto
): Promise<Note | null> => {
  try {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });
    const data = await response.json();
    return data as Note;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteNote = async (id: string): Promise<Note | null> => {
  try {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const toggleNoteFavorite = async (id: string): Promise<Note | null> => {
  const response = await fetch(`${API_URL}/notes/${id}/favorite`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data) {
    throw new Error("Failed to toggle favorite status");
  }

  return data as Note;
};

// Third party libraries
import type { CreateNoteDto, Note, UpdateNoteDto } from "@notes-app/types";

const API_URL = import.meta.env.VITE_API_URL;

export const getNotes = async (): Promise<Note[] | null> => {
  try {
    const response = await fetch(`${API_URL}/notes`);
    const data = await response.json();
    return data as Note[];
  } catch (error) {
    console.error(error);
    return null;
  }
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
  note: UpdateNoteDto,
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

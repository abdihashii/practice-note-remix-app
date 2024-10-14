import { CreateNoteDto, Note } from "~/types";

const API_URL = "http://localhost:3000";

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

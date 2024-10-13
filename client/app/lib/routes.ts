import { Note } from "~/types";

export const getNotes = async (API_URL: string): Promise<Note[] | null> => {
  try {
    const response = await fetch(`${API_URL}/notes`);
    const data = await response.json();
    return data as Note[];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteNote = async (
  API_URL: string,
  id: string
): Promise<Note | null> => {
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

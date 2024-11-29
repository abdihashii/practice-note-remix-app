// Note related types
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
}

/**
 * DTOs - Data Transfer Objects used for better data handling when
 * creating or updating notes (e.g. validating data).
 */
export interface CreateNoteDto {
  title: string;
  content: string;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
}

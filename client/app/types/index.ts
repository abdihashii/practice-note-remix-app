export interface Note {
  id: string; // UUID
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  favorite: boolean;
}

/**
 * DTOs - Data Transfer Objects used for better data handling when
 * creating or updating notes (e.g. validating data).
 */
export interface CreateNoteDto {
  title: string;
  content: string;
  favorite?: boolean;
}
export interface UpdateNoteDto {
  title?: string;
  content?: string;
  favorite?: boolean;
}

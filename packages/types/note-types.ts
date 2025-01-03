/**
 * Represents a note in the system.
 * This is the full note type as stored in the database and returned by the API.
 * Contains all note properties including metadata like timestamps and ownership.
 */
export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string | null /** Can be null for empty notes */;
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
}

/**
 * Data Transfer Object (DTO) for creating a new note.
 * Contains only the fields that can be set during note creation.
 * Other fields like id and timestamps are handled by the server.
 */
export interface CreateNoteDto {
  title: string;
  content?: string;
  favorite?: boolean;
}

/**
 * Data Transfer Object (DTO) for updating an existing note.
 * All fields are optional since any subset of properties can be updated.
 * Timestamps and IDs are automatically updated by the server.
 */
export interface UpdateNoteDto {
  title?: string;
  content?: string;
  favorite?: boolean;
}

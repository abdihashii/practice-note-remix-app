export interface Note {
  id: string; // UUID
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  favorite: boolean;
}

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

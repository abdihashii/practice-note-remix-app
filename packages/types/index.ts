/**
 * Note types
 */
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
export type CreateNoteDto = {
  title: string;
  content: string;
  favorite?: boolean;
};

export type UpdateNoteDto = Partial<CreateNoteDto>;

/**
 * Pagination types
 */
export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  error: string | null;
  results: T[];
  pagination: PaginationMetadata;
}

/**
 * Search types
 */
export interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
}

/**
 * Common types for API requests
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * UI State types
 */
export type SaveButtonState = "default" | "loading" | "success" | "failure";

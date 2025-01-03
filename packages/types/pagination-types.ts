/**
 * Metadata about the pagination of a response
 */
export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * A response that contains a list of results and pagination metadata
 */
export interface PaginatedResponse<T> {
  error: string | null;
  results: T[];
  pagination: PaginationMetadata;
}

/**
 * Parameters for pagination
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

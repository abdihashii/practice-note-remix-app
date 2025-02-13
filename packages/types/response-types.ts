import type { PaginationMetadata } from "./pagination-types";

/**
 * A transformed paginated response that uses searchResults instead of results.
 * Used by search and list endpoints that transform PaginatedResponse.
 */
export interface TransformedPaginatedResponse<T> {
  searchResults: T[];
  pagination: PaginationMetadata;
}

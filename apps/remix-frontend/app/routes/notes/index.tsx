// React
import { Link, useSearchParams } from "react-router";

// Third-party imports
import type { Note } from "@notes-app/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

// First-party imports
import AddNoteButton from "~/components/common/AddNoteButton";
import SearchBar from "~/components/common/SearchBar";
import NoteCard from "~/components/notes/NoteCard";
import { useNotes } from "~/hooks/use-notes";
import { cn } from "~/lib/utils";
import { useAuthStore } from "~/providers/AuthProvider";
import { NotesLoadingSkeleton } from "./NotesLoadingSkeleton";

const ITEMS_PER_PAGE = 10;

export default function NotesPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";
  const currentPage = Number(searchParams.get("page") ?? "1");

  const { user } = useAuthStore();
  const { data, isPending, error } = useNotes({
    searchQuery,
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    enabled: !!user,
  });

  /**
   * Renders a pagination component for navigating through notes pages.
   *
   * Features:
   * - Displays up to 5 page numbers at a time
   * - Shows first and last page numbers always
   * - Uses ellipsis (...) for hidden page numbers
   * - Includes Previous/Next navigation buttons
   * - Maintains search query parameters in pagination links
   * - Disables Previous button on first page
   * - Disables Next button on last page
   *
   * @returns {JSX.Element | null} Returns a Pagination component when there's data,
   *                               or null when there's no pagination data available
   */
  const renderPagination = () => {
    if (!data?.pagination) return null;

    const { page, totalPages } = data.pagination;
    const maxVisiblePages = 5;
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      pages.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible pages
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      // Add ellipsis if needed
      if (start > 2) pages.push("ellipsis");

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) pages.push("ellipsis");

      // Always show last page
      pages.push(totalPages);
    }

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`?${new URLSearchParams({
                ...(searchQuery ? { q: searchQuery } : {}),
                page: String(page - 1),
              })}`}
              className={cn(page <= 1 && "pointer-events-none opacity-50")}
            />
          </PaginationItem>

          {pages.map((pageNum, idx) =>
            pageNum === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href={`?${new URLSearchParams({
                    ...(searchQuery ? { q: searchQuery } : {}),
                    page: String(pageNum),
                  })}`}
                  isActive={pageNum === page}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href={`?${new URLSearchParams({
                ...(searchQuery ? { q: searchQuery } : {}),
                page: String(page + 1),
              })}`}
              className={cn(
                page >= data.pagination.totalPages &&
                  "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const renderNotes = (notes: Note[]) => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <Link
          to={`/notes/${note.id}`}
          key={note.id}
          className={cn(
            "group h-full transition-all duration-200 ease-in-out",
            "hover:-translate-y-0.5"
          )}
        >
          <NoteCard note={note} />
        </Link>
      ))}
    </div>
  );

  return (
    <div className="relative flex-grow space-y-4">
      <div className="flex items-center justify-between gap-4 pb-4">
        <div className="flex-1">
          <SearchBar defaultQuery={searchQuery} />
        </div>
        <AddNoteButton />
      </div>

      {isPending && <NotesLoadingSkeleton />}

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          Error: {error.message}
        </div>
      )}

      {!isPending && data?.searchResults && data.searchResults.length > 0 ? (
        <>
          {renderNotes(data.searchResults)}
          {renderPagination()}
        </>
      ) : (
        !isPending && (
          <div className="text-center text-gray-500">
            {searchQuery
              ? "No notes found matching your search"
              : "No notes yet"}
          </div>
        )
      )}
    </div>
  );
}

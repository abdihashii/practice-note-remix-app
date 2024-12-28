// Remix and React
import { Metadata } from "next";
import { Suspense } from "react";

// First-party imports
import { getNotes } from "@/app/api/notes";
import { searchNotes } from "@/app/api/search";
import AddNoteButton from "@/components/common/AddNoteButton";
import ProtectedLayout from "@/components/common/layout/ProtectedLayout";
import SearchBar from "@/components/common/SearchBar";
import { SearchBarFallback } from "@/components/common/SearchBarFallback";
import NotesClientPage from "@/components/notes/NotesClientPage";
import { NotesLoadingSkeleton } from "@/components/notes/NotesLoadingSkeleton";

export const metadata: Metadata = {
  title: "Your Notes | Notes App",
  description: "Your Notes",
};

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const query = (await searchParams)["q"] ?? "";

  // Fetch initial data on server
  const initialData = query
    ? (await searchNotes(query)).searchResults
    : (await getNotes()) ?? [];

  return (
    <ProtectedLayout>
      <div className="relative flex-grow space-y-4">
        <div className="flex items-center justify-between gap-4 border-b pb-4">
          <div className="flex-1">
            <Suspense fallback={<SearchBarFallback />}>
              <SearchBar defaultQuery={query} />
            </Suspense>
          </div>
          <AddNoteButton />
        </div>
        <Suspense fallback={<NotesLoadingSkeleton />}>
          <NotesClientPage
            initialQuery={query}
            initialData={initialData} // Pass initial data
          />
        </Suspense>
      </div>
    </ProtectedLayout>
  );
}

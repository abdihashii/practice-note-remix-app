// Remix and React
import { Metadata } from "next";
import { Suspense } from "react";

// First-party imports
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

  return (
    <ProtectedLayout>
      <div className="relative flex-grow space-y-4">
        <div className="flex h-12 items-center justify-between gap-4">
          <Suspense fallback={<SearchBarFallback />}>
            <SearchBar defaultQuery={query} />
          </Suspense>
        </div>
        <Suspense fallback={<NotesLoadingSkeleton />}>
          <NotesClientPage initialQuery={query} />
        </Suspense>
      </div>
    </ProtectedLayout>
  );
}

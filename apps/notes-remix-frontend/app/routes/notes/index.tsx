// Third-party imports
import AddNoteButton from "@/components/common/AddNoteButton";
import SearchBar from "@/components/common/SearchBar";

export default function NotesPage() {
  return (
    <div className="relative flex-grow space-y-4">
      <div className="flex items-center justify-between gap-4 pb-4">
        <div className="flex-1">
          {/* <Suspense fallback={<SearchBarFallback />}> */}
          <SearchBar defaultQuery={""} />
          {/* </Suspense> */}
        </div>
        <AddNoteButton />
      </div>
      {/* <Suspense fallback={<NotesLoadingSkeleton />}>
        <NotesClientPage
          initialQuery={query}
          initialData={initialData} // Pass initial data
        />
      </Suspense> */}
    </div>
  );
}

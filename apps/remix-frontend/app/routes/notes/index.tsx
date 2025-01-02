// Third-party imports
import { useQuery } from "@tanstack/react-query";
import AddNoteButton from "~/components/common/AddNoteButton";
import SearchBar from "~/components/common/SearchBar";
import { getNotes } from "~/api/notes";

export default function NotesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["notes"],
    queryFn: () => getNotes(),
  });

  return (
    <div className="relative flex-grow space-y-4">
      <div className="flex items-center justify-between gap-4 pb-4">
        <div className="flex-1">
          <SearchBar defaultQuery={""} />
        </div>
        <AddNoteButton />
      </div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {/* {data && <div>Data: {JSON.stringify(data)}</div>} */}
    </div>
  );
}

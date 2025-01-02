// React
import { Link } from "react-router";

// Third-party imports
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";

// First-party imports
import { getNotes } from "~/api/notes";
import AddNoteButton from "~/components/common/AddNoteButton";
import SearchBar from "~/components/common/SearchBar";
import NoteCard from "~/components/notes/NoteCard";

export default function NotesPage() {
  const { data, isPending, error } = useQuery({
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

      {isPending && (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500 gap-2">
          <Loader2Icon className="h-6 w-6 animate-spin" />
          Loading notes
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          Error: {error.message}
        </div>
      )}

      {data && (
        <div className="space-y-4">
          {data.map((note) => (
            <Link to={`/notes/${note.id}`} key={note.id}>
              <NoteCard note={note} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

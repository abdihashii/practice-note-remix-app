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
import type { Note } from "@notes-app/types";
import { cn } from "~/lib/utils";
import { NotesLoadingSkeleton } from "./NotesLoadingSkeleton";

export default function NotesPage() {
  const { data, isPending, error } = useQuery({
    queryKey: ["notes"],
    queryFn: () => getNotes(),
  });

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
          <SearchBar defaultQuery={""} />
        </div>
        <AddNoteButton />
      </div>

      {isPending && <NotesLoadingSkeleton />}

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          Error: {error.message}
        </div>
      )}

      {data && data.length > 0 && renderNotes(data)}
    </div>
  );
}

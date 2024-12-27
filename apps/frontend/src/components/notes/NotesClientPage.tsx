"use client";

// Remix and React
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Third-party imports
import { Button } from "@/components/ui/button";
import { CreateNoteDto, Note } from "@notes-app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// First-party imports
import { createNote, getNotes } from "@/app/api/notes";
import { searchNotes } from "@/app/api/search";
import AddNoteButton from "@/components/common/AddNoteButton";
import { CreateNoteDialogForm } from "@/components/notes/CreateNoteDialogForm";
import NoteCard from "@/components/notes/NoteCard";
import { NotesLoadingSkeleton } from "@/components/notes/NotesLoadingSkeleton";
import { cn } from "@/lib/utils";

interface NotesClientPageProps {
  initialQuery: string;
  initialData: Note[];
}

export default function NotesClientPage({
  initialQuery,
  initialData,
}: NotesClientPageProps) {
  const [openCreateNoteDialog, setOpenCreateNoteDialog] = useState(false);

  const router = useRouter();

  const queryClient = useQueryClient();

  const {
    data: notesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notes", initialQuery],
    queryFn: async () => {
      if (initialQuery) {
        const searchData = await searchNotes(initialQuery);
        return searchData.searchResults;
      }
      return getNotes();
    },
    initialData,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 3, // stale time means that the data is considered fresh for 3 hours
    gcTime: 1000 * 60 * 60 * 24 * 3, // garbage collect after 3 days
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleCreateNote = async (note: CreateNoteDto) => {
    createNoteMutation.mutate(note);
  };

  const renderNotes = (notes: Note[]) => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <Link
          href={`/notes/${note.id}`}
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
      <div className="flex h-12 items-center justify-between gap-4">
        <AddNoteButton />
      </div>

      {isLoading ? (
        <NotesLoadingSkeleton />
      ) : isError ? (
        <div className="py-10 text-center">
          <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Oops! Something went wrong
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            We&apos;re having trouble loading your notes. Please try again
            later.
          </p>
          <Button onClick={() => router.refresh()}>Refresh Page</Button>
        </div>
      ) : notesData && notesData.length > 0 ? (
        renderNotes(notesData)
      ) : (
        <p className="py-10 text-center text-gray-600 dark:text-gray-400">
          {initialQuery
            ? "No results found. Try a different search term."
            : "No notes yet. Create one!"}
        </p>
      )}

      <CreateNoteDialogForm
        open={openCreateNoteDialog}
        onClose={() => setOpenCreateNoteDialog(false)}
        onSubmit={handleCreateNote}
        isPending={createNoteMutation.isPending}
      />
    </div>
  );
}

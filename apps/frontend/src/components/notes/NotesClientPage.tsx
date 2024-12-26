"use client";

// Remix and React
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

// Third-party imports
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateNoteDto, Note } from "@notes-app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// First-party imports
import { createNote, getNotes } from "@/app/api/notes";
import { searchNotes } from "@/app/api/search";
import AddNoteButton from "@/components/common/AddNoteButton";
import SearchBar from "@/components/common/SearchBar";
import { CreateNoteDialogForm } from "@/components/notes/CreateNoteDialogForm";
import NoteCard from "@/components/notes/NoteCard";
import { cn } from "@/lib/utils";

export default function NotesClientPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const router = useRouter();

  const [openCreateNoteDialog, setOpenCreateNoteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState(q);

  const queryClient = useQueryClient();
  const {
    data: notesData,
    isLoading: isNotesLoading,
    isError: isNotesError,
  } = useQuery({
    queryKey: ["notes", q],
    queryFn: async () => {
      if (q) {
        const searchData = await searchNotes(q);
        return searchData.searchResults;
      }
      return getNotes();
    },
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

  const renderNoteGrid = (notesToRender: Note[], isLoading: boolean) => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="flex h-full flex-col">
              <CardHeader>
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="mb-2 h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </CardContent>
              <CardFooter className="justify-end">
                <div className="flex w-full flex-col space-y-2 md:w-auto md:flex-row md:space-x-2 md:space-y-0">
                  <Skeleton className="h-9 w-full md:w-20" />
                  <Skeleton className="h-9 w-full md:w-20" />
                </div>
              </CardFooter>
            </Card>
          ))
        : notesToRender.map((note) => (
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

  const handleSearch = (query: string) => {
    router.push(`/notes?q=${query}`);
  };

  return (
    <div className="relative flex-grow space-y-4">
      <div className="flex h-12 items-center justify-between gap-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
        />
        <AddNoteButton />
      </div>

      {isNotesLoading ? (
        renderNoteGrid([], true)
      ) : isNotesError ? (
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
        renderNoteGrid(notesData, false)
      ) : (
        <p className="py-10 text-center text-gray-600 dark:text-gray-400">
          {q
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

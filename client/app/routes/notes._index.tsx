// Remix and React
import type { MetaFunction } from "@remix-run/node";
import { Link, useNavigate, useSearchParams } from "@remix-run/react";
import { ReactNode, useState } from "react";

// First party libraries
import { createNote, getNotes } from "~/api/notes";
import { searchNotes } from "~/api/search";
import { CreateNoteDto, Note } from "~/types";

// Third party components
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

// First party components
import FloatingActionButton from "~/components/common/FloatingActionButton";
import ProtectedLayout from "~/components/common/layout/ProtectedLayout";
import SearchBar from "~/components/common/SearchBar";
import { CreateNoteDialogForm } from "~/components/notes/CreateNoteDialogForm";
import NoteCard from "~/components/notes/NoteCard";

export const meta: MetaFunction = () => {
  return [
    { title: "Notes App" },
    { name: "description", content: "Notes App" },
  ];
};

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const [openCreateNoteDialog, setOpenCreateNoteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState(q);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: notes,
    isLoading: isNotesLoading,
    isError: isNotesError,
  } = useQuery({
    queryKey: ["notes", q],
    queryFn: () => (q ? searchNotes(q) : getNotes()),
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

  const handleFloatingActionClick = () => {
    setOpenCreateNoteDialog(true);
  };

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
            <Link to={`/notes/${note.id}`} key={note.id}>
              <NoteCard note={note} />
            </Link>
          ))}
    </div>
  );

  const handleSearch = (query: string) => {
    setSearchParams({ q: query });
  };

  return (
    <ProtectedLayout>
      <div className="relative flex-grow space-y-4">
        <div>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
          />
        </div>

        {isNotesLoading ? (
          renderNoteGrid([], true)
        ) : isNotesError ? (
          <div className="py-10 text-center">
            <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Oops! Something went wrong
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              We're having trouble loading your notes. Please try again later.
            </p>
            <Button onClick={() => navigate(".", { replace: true })}>
              Refresh Page
            </Button>
          </div>
        ) : notes && notes.length > 0 ? (
          renderNoteGrid(notes, false)
        ) : (
          <p className="py-10 text-center text-gray-600 dark:text-gray-400">
            {q
              ? "No results found. Try a different search term."
              : "No notes yet. Create one!"}
          </p>
        )}

        <FloatingActionButton onClick={handleFloatingActionClick} />

        <CreateNoteDialogForm
          open={openCreateNoteDialog}
          onClose={() => setOpenCreateNoteDialog(false)}
          onSubmit={handleCreateNote}
          isPending={createNoteMutation.isPending}
        />
      </div>
    </ProtectedLayout>
  );
}

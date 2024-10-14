// Remix and React
import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

// First party libraries
import { createNote, getNotes } from "~/lib/routes";
import { CreateNoteDto } from "~/types";

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
import FloatingActionButton from "~/components/FloatingActionButton";
import Layout from "~/components/Layout/Layout";
import { CreateNoteDialog } from "~/components/notes/CreateNoteDialog";
import NoteCard from "~/components/notes/NoteCard";

export const meta: MetaFunction = () => {
  return [
    { title: "Notes App" },
    { name: "description", content: "Notes App" },
  ];
};

export default function Index() {
  const [openCreateNoteDialog, setOpenCreateNoteDialog] = useState(false);

  const queryClient = useQueryClient();
  const {
    data: notes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => getNotes(),
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

  return (
    <Layout>
      <div className="relative flex-grow">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="flex flex-col h-full">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="flex-grow">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-4/6" />
                </CardContent>
                <CardFooter className="justify-end">
                  <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0 w-full md:w-auto">
                    <Skeleton className="h-9 w-full md:w-20" />
                    <Skeleton className="h-9 w-full md:w-20" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We're having trouble loading your notes. Please try again later.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        ) : notes && notes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) =>
              note ? (
                <NoteCard key={note.id} note={note} />
              ) : (
                <p className="text-center text-gray-600">
                  There was an error loading this note.
                </p>
              )
            )}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 py-10">
            No notes yet. Create one!
          </p>
        )}
        <FloatingActionButton onClick={handleFloatingActionClick} />

        <CreateNoteDialog
          open={openCreateNoteDialog}
          onClose={() => setOpenCreateNoteDialog(false)}
          onSubmit={handleCreateNote}
          isPending={createNoteMutation.isPending}
        />
      </div>
    </Layout>
  );
}

import type { MetaFunction } from "@remix-run/node";

import { getNotes } from "~/lib/routes";

import { useQuery } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

import FloatingActionButton from "~/components/FloatingActionButton";
import Layout from "~/components/Layout/Layout";
import NoteCard from "~/components/notes/NoteCard";

export const meta: MetaFunction = () => {
  return [
    { title: "Notes App" },
    { name: "description", content: "Notes App" },
  ];
};

export default function Index() {
  const {
    data: notes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => getNotes(),
  });

  return (
    <Layout>
      <div className="relative flex-grow">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-[125px] w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
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
        <FloatingActionButton />
      </div>
    </Layout>
  );
}

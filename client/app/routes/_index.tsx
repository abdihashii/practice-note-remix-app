import type { MetaFunction } from "@remix-run/node";
import { useLoaderData, json } from "@remix-run/react";

import { getNotes } from "~/lib/routes";

import Layout from "~/components/Layout/Layout";
import NoteCard from "~/components/notes/NoteCard";
import FloatingActionButton from "~/components/FloatingActionButton";

export const meta: MetaFunction = () => {
  return [
    { title: "Notes App" },
    { name: "description", content: "Notes App" },
  ];
};

export async function loader() {
  const API_URL = process.env.API_URL;

  if (!API_URL) {
    console.error("API_URL is not set");
    return { notes: [] };
  }

  const notes = await getNotes(API_URL);

  if (!notes) {
    throw new Response("No notes found", { status: 404 });
  }

  return json({ notes });
}

export default function Index() {
  const { notes } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="relative flex-grow">
        {notes.length > 0 ? (
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
          <p className="text-center text-gray-600">No notes yet. Create one!</p>
        )}
        <FloatingActionButton />
      </div>
    </Layout>
  );
}

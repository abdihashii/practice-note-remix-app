import type { MetaFunction } from "@remix-run/node";

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
  return (
    <Layout>
      <div className="relative flex-grow">
        {/* {notes.length > 0 ? (
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
        )} */}
        <FloatingActionButton />
      </div>
    </Layout>
  );
}

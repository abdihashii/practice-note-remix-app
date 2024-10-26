// Remix and React
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

// First party libraries
import { getNoteById } from "~/api/notes";

// First party components
import ProtectedLayout from "~/components/common/layout/ProtectedLayout";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  if (!id) {
    return redirect("/notes");
  }

  const note = await getNoteById(id);
  return json({ note });
}

export default function NotePage() {
  const { note } = useLoaderData<typeof loader>();

  return (
    <ProtectedLayout>
      {note ? (
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">{note.title}</h1>
          <p className="text-sm text-muted-foreground">{note.createdAt}</p>
          <p className="text-lg">{note.content}</p>
        </div>
      ) : (
        <div>
          <p>Note not found</p>
          <Link to="/notes">Go back to the notes page</Link>
        </div>
      )}
    </ProtectedLayout>
  );
}

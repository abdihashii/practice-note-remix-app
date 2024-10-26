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
        <div>Note page for {note.title}</div>
      ) : (
        <div>
          <p>Note not found</p>
          <Link to="/notes">Go back to the notes page</Link>
        </div>
      )}
    </ProtectedLayout>
  );
}

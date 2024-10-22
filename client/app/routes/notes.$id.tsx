// Remix and React
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

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

  console.log(note);

  return (
    <ProtectedLayout>
      <div>Note page for {note?.title}</div>
    </ProtectedLayout>
  );
}

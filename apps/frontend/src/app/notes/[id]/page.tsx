// First-party imports
import ProtectedLayout from "@/components/common/layout/ProtectedLayout";
import NoteClientPage from "@/components/notes/NoteClientPage";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const noteId = (await params).id;

  return (
    <ProtectedLayout>
      <NoteClientPage noteId={noteId} />
    </ProtectedLayout>
  );
}

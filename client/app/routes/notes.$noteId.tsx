// Remix and React
import { Link, useParams } from "@remix-run/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, PenLineIcon, SaveIcon } from "lucide-react";
import { useState } from "react";

// First party libraries
import { getNoteById } from "~/api/notes";

// Third party components
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

// First party components
import ProtectedLayout from "~/components/common/layout/ProtectedLayout";
import NoteEditor from "~/components/notes/NoteEditor";
import useNoteEditor from "~/components/notes/NoteEditor/hooks/useNoteEditor";
import { format } from "date-fns";

export default function NotePage() {
  const params = useParams();
  const queryClient = useQueryClient();

  const {
    data: note,
    isLoading: isLoadingNote,
    isError: isErrorNote,
  } = useQuery({
    queryKey: ["note", params.noteId],
    queryFn: () => getNoteById(params.noteId!),
    enabled: !!params.noteId,
  });

  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const { handleUpdateNote } = useNoteEditor({
    initialContent: note?.content || "",
    noteId: note?.id,
  });

  const onEditTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleSaveTitle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get("title") as string;

      await handleUpdateNote(title);

      await handleSave();
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditingTitle(false);
    }
  };

  const handleSave = async () => {
    // Invalidate all queries
    await queryClient.resetQueries();
  };

  if (isLoadingNote) {
    return (
      <ProtectedLayout>
        <Loader2 className="animate-spin" />
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      {note ? (
        <div className="flex flex-col gap-4">
          <div className="group flex items-center gap-2">
            {isEditingTitle ? (
              <form
                onSubmit={handleSaveTitle}
                className="flex flex-1 items-center gap-2"
              >
                <Input type="text" name="title" defaultValue={note.title} />
                <Button
                  type="submit"
                  variant="outline"
                  size="icon"
                  className="cursor-pointer"
                >
                  <SaveIcon className="h-4 w-4" />
                </Button>
              </form>
            ) : (
              <>
                <h1 className="text-4xl font-bold">{note.title}</h1>
                <PenLineIcon
                  className="hidden h-4 w-4 cursor-pointer group-hover:block"
                  onClick={onEditTitleClick}
                />
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Last updated at:</span>{" "}
            {format(new Date(note.updatedAt), "MMM d, yyyy 'at' h:mm a")}
          </p>

          <NoteEditor
            initialContent={note.content}
            noteId={note.id}
            onSave={handleSave}
          />
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

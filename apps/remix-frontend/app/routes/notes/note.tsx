// React
import { useState } from "react";
import { Link } from "react-router";

// Third-party imports
import { Loader2Icon, PenLineIcon, SaveIcon } from "lucide-react";

// First-party imports
import type { Route } from "./+types";
import { FavoriteButton } from "~/components/notes/FavoriteButton";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { format } from "date-fns";
import NoteEditor from "~/components/notes-editor/NoteEditor";
import useNoteEditor from "~/hooks/use-note-editor";
import { useNote } from "~/hooks/use-note";

export default function NotePage({ params }: Route.ComponentProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const { note, isPending, error, invalidateNote } = useNote({
    noteId: params.id!,
    enabled: !!params.id,
  });
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
      await invalidateNote();
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditingTitle(false);
    }
  };

  if (isPending) {
    return <Loader2Icon className="animate-spin" />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!note) {
    return (
      <div>
        <p>Note not found</p>
        <Link to="/notes">Go back to the notes page</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="w-fit">
        <FavoriteButton
          noteId={note.id}
          isFavorite={note.favorite}
          variant="outline"
        />
      </div>
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
        initialContent={note.content ?? ""}
        noteId={note.id}
        onSave={invalidateNote}
      />
    </div>
  );
}

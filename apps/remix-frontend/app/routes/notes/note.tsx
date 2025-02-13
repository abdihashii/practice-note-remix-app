// React
import { useState } from "react";
import { Link } from "react-router";

// Third-party imports
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, PenLineIcon, SaveIcon } from "lucide-react";

// First-party imports
import { getNoteById } from "~/api/notes";
import type { Route } from "./+types";
import { FavoriteButton } from "~/components/notes/FavoriteButton";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { format } from "date-fns";
import NoteEditor from "~/components/notes-editor/NoteEditor";
import useNoteEditor from "~/hooks/use-note-editor";

export default function NotePage({ params }: Route.ComponentProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const queryClient = useQueryClient();
  const { data, isPending, error } = useQuery({
    queryKey: ["note", params.id],
    queryFn: () => getNoteById(params.id!),
    enabled: !!params.id,
  });
  const { handleUpdateNote } = useNoteEditor({
    initialContent: data?.content || "",
    noteId: data?.id,
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

  if (isPending) {
    return <Loader2Icon className="animate-spin" />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
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
          noteId={data.id}
          isFavorite={data.favorite}
          variant="outline"
        />
      </div>
      <div className="group flex items-center gap-2">
        {isEditingTitle ? (
          <form
            onSubmit={handleSaveTitle}
            className="flex flex-1 items-center gap-2"
          >
            <Input type="text" name="title" defaultValue={data.title} />
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
            <h1 className="text-4xl font-bold">{data.title}</h1>
            <PenLineIcon
              className="hidden h-4 w-4 cursor-pointer group-hover:block"
              onClick={onEditTitleClick}
            />
          </>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        <span className="font-medium">Last updated at:</span>{" "}
        {format(new Date(data.updatedAt), "MMM d, yyyy 'at' h:mm a")}
      </p>

      <NoteEditor
        initialContent={data.content ?? ""}
        noteId={data.id}
        onSave={handleSave}
      />
    </div>
  );
}

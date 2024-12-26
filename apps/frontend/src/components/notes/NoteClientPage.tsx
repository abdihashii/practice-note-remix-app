"use client";

// React and Next
import Link from "next/link";
import { useState } from "react";

// Third-party imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, PenLineIcon, SaveIcon } from "lucide-react";

// First-party imports
import { getNoteById } from "@/app/api/notes";
import ProtectedLayout from "@/components/common/layout/ProtectedLayout";
import { FavoriteButton } from "@/components/notes/FavoriteButton";
import NoteEditor from "@/components/notes/NoteEditor";
import useNoteEditor from "@/hooks/use-note-editor";

export default function NoteClientPage({ noteId }: { noteId: string }) {
  const queryClient = useQueryClient();

  const { data: note, isLoading: isLoadingNote } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => getNoteById(noteId),
    enabled: !!noteId,
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

  return note ? (
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
        initialContent={note.content}
        noteId={note.id}
        onSave={handleSave}
      />
    </div>
  ) : (
    <div>
      <p>Note not found</p>
      <Link href="/notes">Go back to the notes page</Link>
    </div>
  );
}

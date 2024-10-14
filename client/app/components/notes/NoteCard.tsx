import { useState } from "react";

import { format } from "date-fns";

import { deleteNote } from "~/lib/routes";
import { Note } from "~/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DeleteConfirmationDialog } from "~/components/notes/DeleteConfirmationDialog";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface NoteCardProps {
  note: Note;
}

const NoteCard = ({ note }: NoteCardProps) => {
  const [openDeleteConfirmationDialog, setOpenDeleteConfirmationDialog] =
    useState(false);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleOpenDeleteConfirmationDialog = (id: string) => {
    setOpenDeleteConfirmationDialog(true);
  };

  return (
    <>
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {format(
              new Date(
                note.updatedAt > note.createdAt
                  ? note.updatedAt
                  : note.createdAt
              ),
              "MMM d, yyyy 'at' h:mm a"
            )}
          </p>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-700 overflow-hidden line-clamp-3 h-[4.5rem]">
            {note.content}
          </p>
        </CardContent>
        <CardFooter className="justify-end">
          <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0 w-full md:w-auto">
            <Button className="w-full md:w-20" variant="outline">
              Edit
            </Button>
            <Button
              className="w-full md:w-20"
              variant="destructive"
              onClick={() => handleOpenDeleteConfirmationDialog(note.id)}
            >
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>

      <DeleteConfirmationDialog
        open={openDeleteConfirmationDialog}
        onClose={() => setOpenDeleteConfirmationDialog(false)}
        onDelete={() => handleDelete(note.id)}
        noteTitle={note.title}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
};

export default NoteCard;

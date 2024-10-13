import { useState } from "react";

import { Note } from "~/types";

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

  const handleDelete = (id: string) => {
    console.log("Deleting note with id:", id);
  };

  const handleOpenDeleteConfirmationDialog = (id: string) => {
    setOpenDeleteConfirmationDialog(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 flex-grow overflow-hidden">
            {note.content.substring(0, 100)}
            {/* Excerpt */}
          </p>
        </CardContent>
        <CardFooter className="justify-end">
          <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0 w-full">
            <Button className="w-full" variant="outline">
              Edit
            </Button>
            <Button
              className="w-full"
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
      />
    </>
  );
};

export default NoteCard;

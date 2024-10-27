// React
import { useState } from "react";

// Third party libraries
import { format } from "date-fns";

// First party libraries
import { Note } from "~/types";

// Third party components
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

// First party components
import { StarIcon } from "lucide-react";
import { DeleteConfirmationDialog } from "~/components/notes/DeleteConfirmationDialog";
import { useNote } from "~/hooks/useNote";
import { StarFilledIcon } from "../common/icons/StarFilledIcon";
import { EditNoteDialogForm } from "./EditNoteDialogForm";

interface NoteCardProps {
  note: Note;
}

const NoteCard = ({ note }: NoteCardProps) => {
  const [openDeleteConfirmationDialog, setOpenDeleteConfirmationDialog] =
    useState(false);
  const [openEditNoteDialog, setOpenEditNoteDialog] = useState(false);

  const { deleteMutation, handleDelete, updateMutation, handleEdit } =
    useNote();

  return (
    <>
      <Card className="flex h-full flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-x-0 space-y-0">
          <div className="flex flex-col gap-1">
            <CardTitle>{note.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {format(
                new Date(
                  note.updatedAt > note.createdAt
                    ? note.updatedAt
                    : note.createdAt,
                ),
                "MMM d, yyyy 'at' h:mm a",
              )}
            </p>
          </div>
          <Button variant="ghost" size="icon">
            {note.favorite ? (
              <StarFilledIcon className="h-4 w-4" />
            ) : (
              <StarIcon className="h-4 w-4" />
            )}
          </Button>
        </CardHeader>
        <CardFooter className="justify-end">
          <div className="flex w-full flex-col space-y-2 md:w-auto md:flex-row md:space-x-2 md:space-y-0">
            <Button
              className="w-full md:w-20"
              variant="outline"
              onClick={() => setOpenEditNoteDialog(true)}
            >
              Edit
            </Button>
            <Button
              className="w-full md:w-20"
              variant="destructive"
              onClick={() => setOpenDeleteConfirmationDialog(true)}
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

      <EditNoteDialogForm
        open={openEditNoteDialog}
        onClose={() => setOpenEditNoteDialog(false)}
        onSubmit={(updatedNote) => handleEdit(note.id, updatedNote)}
        isPending={updateMutation.isPending}
        note={note}
      />
    </>
  );
};

export default NoteCard;

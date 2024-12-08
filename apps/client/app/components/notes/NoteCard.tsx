// React
import { useState } from "react";

// Third party libraries
import { format, isAfter, parseISO } from "date-fns";
import { cn } from "~/lib/utils";
import { Note } from "@notes-app/types";

// Third party components
import { Card, CardHeader, CardTitle } from "~/components/ui/card";

// First party components
import { useNote } from "~/hooks/useNote";
import { EditNoteDialogForm } from "./EditNoteDialogForm";

interface NoteCardProps {
  note: Note;
}

const NoteCard = ({ note }: NoteCardProps) => {
  const [openEditNoteDialog, setOpenEditNoteDialog] = useState(false);

  const { updateMutation, handleEdit } = useNote();

  return (
    <>
      <Card
        className={cn(
          "h-full transition-colors duration-200 ease-in-out",
          "group-hover:bg-secondary/50",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between space-x-0 space-y-0">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg font-semibold group-hover:text-primary">
              {note.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {format(
                new Date(
                  isAfter(parseISO(note.updatedAt), parseISO(note.createdAt))
                    ? note.updatedAt
                    : note.createdAt,
                ),
                "MMM d, yyyy 'at' h:mm a",
              )}
            </p>
          </div>
        </CardHeader>
      </Card>

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

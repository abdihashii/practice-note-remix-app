import { useState } from "react";

import { Note } from "~/types";

import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

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
    <div className="bg-gray-100 rounded-lg p-4 h-48 flex flex-col">
      <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
      <p className="text-gray-700 flex-grow overflow-hidden">
        {note.content.substring(0, 100)}
        {/* Excerpt */}
      </p>
      <div className="flex justify-end space-x-2 mt-4">
        <button className="text-blue-600 hover:underline">Edit</button>
        <button
          className="text-red-600 hover:underline"
          onClick={() => handleOpenDeleteConfirmationDialog(note.id)}
        >
          Delete
        </button>
      </div>

      <DeleteConfirmationDialog
        open={openDeleteConfirmationDialog}
        onClose={() => setOpenDeleteConfirmationDialog(false)}
        onDelete={() => handleDelete(note.id)}
        noteTitle={note.title}
      />
    </div>
  );
};

export default NoteCard;

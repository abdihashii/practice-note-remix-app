import { useState } from "react";

// import { deleteNode } from "~/lib/routes";
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
import { useLoaderData, json } from "@remix-run/react";

export async function loader() {
  console.log(process.env.API_URL);

  const API_URL = process.env.API_URL;
  return json({ API_URL });
}

interface NoteCardProps {
  note: Note;
}

const NoteCard = ({ note }: NoteCardProps) => {
  const [openDeleteConfirmationDialog, setOpenDeleteConfirmationDialog] =
    useState(false);

  const { API_URL } = useLoaderData<typeof loader>();

  const handleDelete = async (id: string) => {
    // if (!API_URL) {
    //   console.error("API_URL is not set");
    //   return;
    // }
    // await deleteNode(API_URL, id);
  };

  const handleOpenDeleteConfirmationDialog = (id: string) => {
    setOpenDeleteConfirmationDialog(true);
  };

  return (
    <>
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-700 overflow-hidden line-clamp-4">
            {note.content}
          </p>
        </CardContent>
        <CardFooter className="justify-end">
          <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0 w-full md:w-auto">
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

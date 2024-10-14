// Remix and React
import React, { useState } from "react";

// First party libraries
import { Note, UpdateNoteDto } from "~/types";

// Third party libraries
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Third party components
import { Loader2Icon, KeyboardIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

const createNoteSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
});

export const EditNoteDialogForm = ({
  open,
  onClose,
  onSubmit,
  isPending,
  note,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (note: UpdateNoteDto) => void;
  isPending: boolean;
  note: Note;
}) => {
  const [showShortcutHint, setShowShortcutHint] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateNoteDto>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: note.title,
      content: note.content,
    },
  });

  const handleCloseDialog = () => {
    reset();
    onClose();
  };

  const handleEditNote = (data: UpdateNoteDto) => {
    onSubmit(data);
    reset();
    onClose();
  };

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        handleSubmit(handleEditNote)();
      }
    },
    [handleSubmit, handleEditNote]
  );

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit note</DialogTitle>
          <DialogDescription>
            Edit the title and content for your note.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleEditNote)}
          className="space-y-4"
          onKeyDown={handleKeyDown}
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input {...register("title")} placeholder="Enter note title" />
            {errors.title ? (
              <p className="text-red-500 text-sm h-4">{errors.title.message}</p>
            ) : (
              <p className="text-gray-500 text-sm h-4"></p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <div className="relative">
              <Textarea
                {...register("content")}
                placeholder="Enter note content"
                className="min-h-[100px] pr-8"
              />
              <div
                className="absolute bottom-2 right-2 text-muted-foreground"
                onMouseEnter={() => setShowShortcutHint(true)}
                onMouseLeave={() => setShowShortcutHint(false)}
              >
                <KeyboardIcon size={16} />
                {showShortcutHint && (
                  <div className="absolute bottom-full right-0 mb-2 bg-secondary text-secondary-foreground text-xs py-2 px-4 rounded shadow w-48 text-center">
                    CMD + Enter to submit form
                  </div>
                )}
              </div>
            </div>
            {errors.content ? (
              <p className="text-red-500 text-sm h-4">
                {errors.content.message}
              </p>
            ) : (
              <p className="text-gray-500 text-sm h-4"></p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Edit Note"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

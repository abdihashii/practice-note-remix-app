// Remix and React
import { useCallback, useState } from "react";

// Third party libraries
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Note, UpdateNoteDto } from "../../../../types";

// Third party components
import { KeyboardIcon, Loader2Icon } from "lucide-react";
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

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        handleSubmit(handleEditNote)();
      }
    },
    [handleSubmit, handleEditNote],
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
              <p className="h-4 text-sm text-red-500">{errors.title.message}</p>
            ) : (
              <p className="h-4 text-sm text-gray-500"></p>
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
                className="absolute bottom-2 right-6 text-muted-foreground"
                onMouseEnter={() => setShowShortcutHint(true)}
                onMouseLeave={() => setShowShortcutHint(false)}
              >
                <KeyboardIcon size={16} />
                {showShortcutHint && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 rounded bg-secondary px-4 py-2 text-center text-xs text-secondary-foreground shadow">
                    CMD + Enter to submit form
                  </div>
                )}
              </div>
            </div>
            {errors.content ? (
              <p className="h-4 text-sm text-red-500">
                {errors.content.message}
              </p>
            ) : (
              <p className="h-4 text-sm text-gray-500"></p>
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

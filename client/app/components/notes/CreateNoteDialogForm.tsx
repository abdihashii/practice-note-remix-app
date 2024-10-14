// First party libraries
import { CreateNoteDto } from "~/types";

// Third party libraries
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Third party components
import { Loader2Icon } from "lucide-react";
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

export const CreateNoteDialogForm = ({
  open,
  onClose,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (note: CreateNoteDto) => void;
  isPending: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateNoteDto>({
    resolver: zodResolver(createNoteSchema),
  });

  const handleCloseDialog = () => {
    reset();
    onClose();
  };

  const handleCreateNote = (data: CreateNoteDto) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new note</DialogTitle>
          <DialogDescription>
            Add a title and content for your new note.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleCreateNote)} className="space-y-4">
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
            <Textarea
              {...register("content")}
              placeholder="Enter note content"
              className="min-h-[100px]"
            />
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
                "Create Note"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

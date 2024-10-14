import { Loader2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "../ui/button";

export const DeleteConfirmationDialog = ({
  open,
  onClose,
  onDelete,
  noteTitle,
  isDeleting,
}: {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  noteTitle: string;
  isDeleting: boolean;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Deleting <strong>{noteTitle}</strong> is irreversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0 w-full md:w-auto">
          <Button
            variant="outline"
            className="w-full md:w-20"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="w-full md:w-20"
            disabled={isDeleting}
            onClick={onDelete}
          >
            {isDeleting ? <Loader2Icon className="animate-spin" /> : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

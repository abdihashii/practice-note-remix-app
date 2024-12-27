"use client";

// Third-party imports
import { Button } from "@/components/ui/button";
import { CheckIcon, Loader2Icon, SaveIcon, XIcon } from "lucide-react";

interface SaveNoteButtonProps {
  saveButtonState: "default" | "loading" | "success" | "failure";
  handleSave: () => void;
  newNote?: boolean;
}

export function SaveNoteButton({
  saveButtonState,
  handleSave,
  newNote = false,
}: SaveNoteButtonProps) {
  const icons = {
    default: <SaveIcon className="h-4 w-4" />,
    loading: <Loader2Icon className="h-4 w-4 animate-spin" />,
    success: <CheckIcon className="h-4 w-4" />,
    failure: <XIcon className="h-4 w-4" />,
  };

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleSave}
      disabled={saveButtonState === "loading"}
      className={`h-8 w-20 gap-1.5 text-secondary ${
        saveButtonState === "loading"
          ? "animate-pulse"
          : saveButtonState === "success"
            ? "bg-green-500"
            : saveButtonState === "failure"
              ? "bg-destructive"
              : ""
      } `}
    >
      {saveButtonState === "default" ? (
        <>
          {icons.default}
          {newNote ? "Create" : "Save"}
        </>
      ) : (
        icons[saveButtonState]
      )}
    </Button>
  );
}

import { PlusIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function AddNoteButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      size="sm"
      onClick={onClick}
      className="flex h-full items-center justify-center gap-2 px-4 font-medium"
    >
      <PlusIcon className="h-4 w-4" />
      <span>Add Note</span>
    </Button>
  );
}

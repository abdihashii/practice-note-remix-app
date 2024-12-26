// Remix and React
import { Link } from "@remix-run/react";

// Third-party imports
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AddNoteButton() {
  return (
    <Link to="/notes/add" className="h-full font-medium">
      <Button
        size="sm"
        className="flex h-full items-center justify-center gap-2 px-4"
      >
        <PlusIcon className="h-4 w-4" />
        <span>Add Note</span>
      </Button>
    </Link>
  );
}

// React
import { Link } from "react-router";

// Third-party imports
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function AddNoteButton() {
  return (
    <Link to="/notes/add">
      <Button
        size="sm"
        className="flex items-center gap-2 whitespace-nowrap transition-all duration-200 hover:gap-3"
      >
        <PlusIcon className="h-4 w-4" />
        <span>New Note</span>
      </Button>
    </Link>
  );
}

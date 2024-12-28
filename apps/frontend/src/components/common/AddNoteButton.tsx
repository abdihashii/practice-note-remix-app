// Remix and React
import Link from "next/link";

// Third-party imports
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AddNoteButton() {
  return (
    <Link href="/notes/add">
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

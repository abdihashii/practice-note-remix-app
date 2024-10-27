import { format } from "date-fns";

import { CreateNoteDto } from "~/types";

const FloatingActionButton = ({
  onClick,
}: {
  onClick: (note: CreateNoteDto) => void;
}) => {
  return (
    <button
      className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg"
      aria-label="Add Note"
      onClick={() =>
        onClick({
          title: `New Note ${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`,
          content: "This is a new note",
        })
      }
    >
      <span className="text-3xl">+</span>
    </button>
  );
};

export default FloatingActionButton;

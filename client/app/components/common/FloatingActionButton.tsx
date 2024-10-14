import { format } from "date-fns";

import { CreateNoteDto } from "~/types";

const FloatingActionButton = ({
  onClick,
}: {
  onClick: (note: CreateNoteDto) => void;
}) => {
  return (
    <button
      className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full h-16 w-16 flex items-center justify-center shadow-lg"
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

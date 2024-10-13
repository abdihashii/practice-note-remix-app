import { Note } from "~/types";

import FloatingActionButton from "~/components/FloatingActionButton";
import NoteCard from "~/components/notes/NoteCard";

interface MainContentProps {
  notes: Note[];
}

const MainContent = ({ notes }: MainContentProps) => {
  return (
    <div className="relative flex-grow">
      {notes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No notes yet. Create one!</p>
      )}
      <FloatingActionButton />
    </div>
  );
};

export default MainContent;

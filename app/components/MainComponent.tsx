import FloatingActionButton from "./FloatingActionButton";
import NoteCard from "./NoteCard";

interface Note {
  id: string;
  title: string;
  content: string;
}

interface MainContentProps {
  notes: Note[];
}

const MainContent = ({ notes }: MainContentProps) => {
  return (
    <div className="relative flex-grow">
      {notes.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
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

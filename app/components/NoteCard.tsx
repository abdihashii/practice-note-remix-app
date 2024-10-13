interface Note {
  id: string;
  title: string;
  content: string;
}

interface NoteCardProps {
  note: Note;
}

const NoteCard = ({ note }: NoteCardProps) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4 h-48 flex flex-col">
      <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
      <p className="text-gray-700 flex-grow overflow-hidden">
        {note.content.substring(0, 100)}
        {/* Excerpt */}
      </p>
      <div className="flex justify-end space-x-2 mt-4">
        <button className="text-blue-600 hover:underline">Edit</button>
        <button className="text-red-600 hover:underline">Delete</button>
      </div>
    </div>
  );
};

export default NoteCard;

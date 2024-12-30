import { Link } from "react-router";

export default function NotesPage() {
  // Let's add some sample notes for demonstration
  const notes = [
    { id: 1, title: "Note 1" },
    { id: 2, title: "Note 2" },
    { id: 3, title: "Note 3" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">All Notes</h2>
      <div className="grid gap-4">
        {notes.map((note) => (
          <Link
            key={note.id}
            to={`/notes/${note.id}`}
            className="block p-4 rounded border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          >
            {note.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

import { Link } from "react-router";

export default function NotesPage() {
  return (
    <div>
      <h1>Notes</h1>
      <div className="flex flex-col">
        <Link to="/">Home</Link>
        <Link to="/notes/1">Go to Note 1</Link>
      </div>
    </div>
  );
}

import { Link, Outlet } from "react-router";

export default function NotesLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="flex items-center justify-between max-w-7xl mx-auto p-4">
          <h1 className="text-xl font-bold">Notes</h1>
          <div className="flex gap-4">
            <Link
              to="/notes"
              className="text-foreground/80 hover:text-foreground"
            >
              All Notes
            </Link>
            <Link to="/" className="text-foreground/80 hover:text-foreground">
              Home
            </Link>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <Outlet />
      </div>
    </div>
  );
}

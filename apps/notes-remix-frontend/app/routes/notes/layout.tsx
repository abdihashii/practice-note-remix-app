import { Link, Outlet } from "react-router";

export default function NotesLayout() {
  return (
    <>
      <header className="border-b">
        <nav className="flex items-center justify-between max-w-7xl mx-auto p-4">
          <h1 className="text-xl font-bold">Notes</h1>
          <ul className="flex gap-4">
            <li>
              <Link
                to="/notes"
                className="text-foreground/80 hover:text-foreground"
              >
                All Notes
              </Link>
            </li>
            <li>
              <Link to="/" className="text-foreground/80 hover:text-foreground">
                Home
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <Outlet />
      </main>
    </>
  );
}

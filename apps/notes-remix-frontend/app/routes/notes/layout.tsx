import { Link, Outlet } from "react-router";

export default function NotesLayout() {
  return (
    <div>
      <header className="bg-gray-100 dark:bg-gray-800 p-4">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Notes
          </h1>
          <div className="flex gap-4">
            <Link
              to="/notes"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              All Notes
            </Link>
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Home
            </Link>
          </div>
        </nav>
      </header>

      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
}

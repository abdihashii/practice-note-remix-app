// React
import { Outlet } from "react-router";

// Third-party imports
// import { Toaster } from "~/components/ui/toaster";
import Header from "~/components/layout/Header";

export default function NotesLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-grow flex-col">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      {/* <Toaster /> */}
    </div>
  );
}

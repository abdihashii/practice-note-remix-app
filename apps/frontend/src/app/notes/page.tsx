// Remix and React
import { Metadata } from "next";

// First-party imports
import ProtectedLayout from "@/components/common/layout/ProtectedLayout";
import NotesClientPage from "@/components/notes/NotesClientPage";

export const metadata: Metadata = {
  title: "Your Notes | Notes App",
  description: "Your Notes",
};

export default function NotesPage() {
  return (
    <ProtectedLayout>
      <NotesClientPage />
    </ProtectedLayout>
  );
}
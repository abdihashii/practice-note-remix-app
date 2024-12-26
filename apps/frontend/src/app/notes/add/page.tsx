// React and Next
import { Metadata } from "next";

// First-party imports
import ProtectedLayout from "@/components/common/layout/ProtectedLayout";
import AddNoteClientPage from "@/components/notes/AddNoteClientPage";

export const metadata: Metadata = {
  title: "Add a Note | Notes App",
  description: "Add a new note",
};

export default function AddNotePage() {
  return (
    <ProtectedLayout>
      <AddNoteClientPage />
    </ProtectedLayout>
  );
}

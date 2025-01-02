// React
import { useState } from "react";
import { useNavigate } from "react-router";

// Third-party imports
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "~/components/ui/input";

// First-party imports
import NoteEditor from "~/components/notes-editor/NoteEditor";

export default function AddNotePage() {
  const [title, setTitle] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSave = async (noteId?: string) => {
    if (noteId) {
      // Invalidate all queries
      await queryClient.resetQueries();

      navigate(`/notes/${noteId}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-12 items-center gap-2">
        <Input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-full text-2xl font-bold"
        />
      </div>

      <NoteEditor
        initialContent=""
        newNote={true}
        title={title}
        onSave={handleSave}
      />
    </div>
  );
}

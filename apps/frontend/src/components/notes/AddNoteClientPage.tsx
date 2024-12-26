"use client";

// React and Next
import { useState } from "react";
import { useRouter } from "next/navigation";

// Third-party imports
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";

// First-party imports
import NoteEditor from "@/components/notes/NoteEditor";

export default function AddNoteClientPage() {
  const [title, setTitle] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSave = async (noteId?: string) => {
    if (noteId) {
      // Invalidate all queries
      await queryClient.resetQueries();

      router.push(`/notes/${noteId}`);
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

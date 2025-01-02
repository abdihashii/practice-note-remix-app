// Third-party imports
import type { UpdateNoteDto } from "@notes-app/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// First-party imports
import { deleteNote, updateNote } from "~/api/notes";

export const useNote = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; note: UpdateNoteDto }) =>
      updateNote(data.id, data.note),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleEdit = async (id: string, updatedNote: UpdateNoteDto) => {
    updateMutation.mutate({ id, note: updatedNote });
  };

  return {
    deleteMutation,
    handleDelete,
    updateMutation,
    handleEdit,
  };
};

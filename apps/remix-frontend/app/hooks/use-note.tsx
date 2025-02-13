// Third-party imports
import { useQuery, useQueryClient } from "@tanstack/react-query";

// First-party imports
import { getNoteById } from "~/api/notes-apis";

interface UseNoteOptions {
  noteId: string;
  enabled?: boolean;
}

/**
 * Hook for managing a single note's data and operations.
 *
 * Features:
 * - Fetches note data by ID
 * - Handles loading and error states
 * - Provides function to invalidate note cache
 *
 * @param options Configuration options for the hook
 * @returns Object containing note data, loading state, error state, and utility functions
 */
export function useNote({ noteId, enabled = true }: UseNoteOptions) {
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => getNoteById(noteId),
    enabled: enabled && !!noteId,
  });

  /**
   * Invalidates the note cache and the notes list to keep them in sync.
   */
  const invalidateNote = async () => {
    await queryClient.invalidateQueries({ queryKey: ["note", noteId] });
    // Also invalidate the notes list to keep it in sync
    await queryClient.invalidateQueries({ queryKey: ["notes"] });
  };

  return {
    note: data,
    isPending,
    error,
    invalidateNote,
  };
}

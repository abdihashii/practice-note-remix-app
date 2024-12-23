// Third-party imports
import type { CreateNoteDto, UpdateNoteDto } from "@notes-app/types";
import { eq } from "drizzle-orm";
import type { Context } from "hono";

// Local imports
import { notesTable } from "@/db/schema";
import {
  handleAuthzError,
  handleResourceError,
} from "@/middleware/errorMiddleware";
import type { CustomEnv } from "@/types";
import type { ValidationError } from "@/types/error-types";

/**
 * Validates data for creating a new note
 */
export function validateCreateNote(data: CreateNoteDto): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.title?.trim()) {
    errors.push({
      field: "title",
      message: "Title is required",
      code: "REQUIRED_FIELD",
    });
  } else if (data.title.length > 255) {
    errors.push({
      field: "title",
      message: "Title must be less than 255 characters",
      code: "INVALID_LENGTH",
      params: { max: 255, current: data.title.length },
    });
  }

  if (data.content && data.content.length > 10000) {
    errors.push({
      field: "content",
      message: "Content must be less than 10000 characters",
      code: "INVALID_LENGTH",
      params: { max: 10000, current: data.content.length },
    });
  }

  return errors;
}

/**
 * Validates data for updating an existing note
 */
export function validateUpdateNote(data: UpdateNoteDto): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.title !== undefined) {
    if (!data.title?.trim()) {
      errors.push({
        field: "title",
        message: "Title cannot be empty",
        code: "INVALID_INPUT",
      });
    } else if (data.title.length > 255) {
      errors.push({
        field: "title",
        message: "Title must be less than 255 characters",
        code: "INVALID_LENGTH",
        params: { max: 255, current: data.title.length },
      });
    }
  }

  if (data.content !== undefined && data.content.length > 10000) {
    errors.push({
      field: "content",
      message: "Content must be less than 10000 characters",
      code: "INVALID_LENGTH",
      params: { max: 10000, current: data.content.length },
    });
  }

  return errors;
}

/**
 * Verifies note ownership and handles related errors
 * Returns the note if found and owned by the user, otherwise handles the error
 */
export async function verifyNoteAccess(
  c: Context<CustomEnv>,
  noteId: string,
  action: "read" | "update" | "delete"
) {
  const db = c.get("db");
  const userId = c.get("userId");

  const note = await db.query.notesTable.findFirst({
    where: eq(notesTable.id, noteId),
  });

  // Check if note exists
  if (!note) {
    throw handleResourceError(c, "Note not found", {
      resourceType: "note",
      resourceId: noteId,
      operation: action,
      reason: "Note does not exist",
    });
  }

  // Verify ownership
  if (note.userId !== userId) {
    throw handleAuthzError(c, "Unauthorized access to note", {
      resource: "note",
      resourceId: noteId,
      action,
      requiredPermissions: [`note:${action}`],
      userPermissions: [],
    });
  }

  return note;
}

/**
 * Handles database errors for note operations
 */
export function handleNoteDbError(
  c: Context<CustomEnv>,
  error: unknown,
  noteId: string | undefined,
  operation: "create" | "read" | "update" | "delete"
) {
  return handleResourceError(c, `Failed to ${operation} note`, {
    resourceType: "note",
    ...(noteId && { resourceId: noteId }),
    operation,
    reason: error instanceof Error ? error.message : "Database error",
  });
}

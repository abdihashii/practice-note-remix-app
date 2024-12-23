// Third-party imports
import type { CreateNoteDto, UpdateNoteDto } from "@notes-app/types";
import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";

// Local imports
import { notesTable } from "@/db/schema";
import { verifyJWT } from "@/middleware/authMiddleware";
import { handleValidationError } from "@/middleware/errorMiddleware";
import type { CustomEnv } from "@/types";
import {
  handleNoteDbError,
  validateCreateNote,
  validateUpdateNote,
  verifyNoteAccess,
} from "@/utils/noteUtils";

export const noteRoutes = new Hono<CustomEnv>();

// Protect all note routes with JWT
noteRoutes.use("*", verifyJWT);

// Get all notes (only user's notes)
noteRoutes.get("/", async (c) => {
  const db = c.get("db");
  const userId = c.get("userId");

  try {
    const notes = await db
      .select()
      .from(notesTable)
      .where(eq(notesTable.userId, userId))
      .orderBy(desc(notesTable.updatedAt));

    return c.json(notes);
  } catch (error) {
    return handleNoteDbError(c, error, undefined, "read");
  }
});

// Get a note by id
noteRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const note = await verifyNoteAccess(c, id, "read");
    return c.json(note);
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    return handleNoteDbError(c, error, id, "read");
  }
});

// Create a new note
noteRoutes.post("/", async (c) => {
  const db = c.get("db");
  const userId = c.get("userId");

  // Get note data from request body
  const noteData = await c.req.json<CreateNoteDto>();

  // Validate input
  const validationErrors = validateCreateNote(noteData);
  if (validationErrors.length > 0) {
    return handleValidationError(c, "Invalid note data", validationErrors);
  }

  try {
    // Create note object with userId and insert into database
    const [newNote] = await db
      .insert(notesTable)
      .values({ ...noteData, userId })
      .returning();

    // Return new note
    return c.json(newNote);
  } catch (error) {
    return handleNoteDbError(c, error, undefined, "create");
  }
});

// Update a note
noteRoutes.put("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  // Get update data from request body
  const noteData = await c.req.json<UpdateNoteDto>();

  // Validate input
  const validationErrors = validateUpdateNote(noteData);
  if (validationErrors.length > 0) {
    return handleValidationError(c, "Invalid note data", validationErrors);
  }

  try {
    // Verify note access and existence
    await verifyNoteAccess(c, id, "update");

    // Update note in database
    const updatedNote = {
      ...noteData,
      updatedAt: new Date(),
    };

    // Update note in database
    await db.update(notesTable).set(updatedNote).where(eq(notesTable.id, id));

    // Return updated note
    const updated = await db.query.notesTable.findFirst({
      where: eq(notesTable.id, id),
    });

    return c.json(updated);
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    return handleNoteDbError(c, error, id, "update");
  }
});

// Delete a note
noteRoutes.delete("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  try {
    // Verify note access and existence
    await verifyNoteAccess(c, id, "delete");

    // Delete note from database
    await db.delete(notesTable).where(eq(notesTable.id, id));

    // Return success message
    return c.json({
      message: "Note deleted successfully",
      noteId: id,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    return handleNoteDbError(c, error, id, "delete");
  }
});

// Toggle favorite status
noteRoutes.patch("/:id/favorite", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  try {
    // Verify note access and get current note
    const currentNote = await verifyNoteAccess(c, id, "update");

    // Toggle the favorite status in the database
    const updatedNote = await db
      .update(notesTable)
      .set({
        favorite: !currentNote.favorite,
        updatedAt: new Date(),
      })
      .where(eq(notesTable.id, id))
      .returning();

    // Return updated note
    return c.json(updatedNote[0]);
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    return handleNoteDbError(c, error, id, "update");
  }
});

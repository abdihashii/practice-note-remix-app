// Third-party imports
import type { CreateNoteDto, UpdateNoteDto } from "@notes-app/types";
import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { verify } from "hono/jwt";

// Local imports
import { notesTable } from "@/db/schema";
import type { CustomEnv } from "@/types";

export const noteRoutes = new Hono<CustomEnv>();

interface JWTPayload {
  userId: string;
  exp?: number;
}

// Protect routes with JWT
noteRoutes.use(
  "*",
  bearerAuth({
    token: process.env["JWT_SECRET"],
    verifyToken: async (token) => {
      try {
        const secret = process.env["JWT_SECRET"];
        if (!secret) throw new Error("JWT_SECRET not configured");

        const payload = (await verify(token, secret)) as unknown as JWTPayload;

        // Check if token is expired
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
          return false;
        }

        // Add userId to context for route handlers
        return true;
      } catch {
        return false;
      }
    },
  })
);

// Get all notes (only user's notes)
noteRoutes.get("/", async (c) => {
  const db = c.get("db");
  const token = c.req.header("Authorization")?.split(" ")[1];

  // Check if token is present before verifying
  if (!token) return c.json({ error: "Unauthorized" }, 401);

  const payload = (await verify(
    token,
    process.env["JWT_SECRET"]!
  )) as unknown as JWTPayload;

  const notes = await db
    .select()
    .from(notesTable)
    .where(eq(notesTable.userId, payload.userId))
    .orderBy(desc(notesTable.updatedAt));

  return c.json(notes);
});

// Get a note by id
noteRoutes.get("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");
  const token = c.req.header("Authorization")?.split(" ")[1];

  // Check if token is present before verifying
  if (!token) return c.json({ error: "Unauthorized" }, 401);

  // Verify token before accessing database
  const payload = (await verify(
    token,
    process.env["JWT_SECRET"]!
  )) as unknown as JWTPayload;

  const note = await db.query.notesTable.findFirst({
    where: eq(notesTable.id, id),
  });

  // Check if note exists
  if (!note) {
    return c.json({ error: "Note not found" }, 404);
  }

  // Verify ownership
  if (note.userId !== payload.userId) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  // Return note
  return c.json(note);
});

// Create a new note
noteRoutes.post("/", async (c) => {
  const db = c.get("db");
  const token = c.req.header("Authorization")?.split(" ")[1];

  // Check if token is present before verifying
  if (!token) return c.json({ error: "Unauthorized" }, 401);

  // Verify token before accessing database
  const payload = (await verify(
    token,
    process.env["JWT_SECRET"]!
  )) as unknown as JWTPayload;

  // Get note data from request body
  const noteData = await c.req.json<CreateNoteDto>();

  // Create note object with userId
  const note = {
    ...noteData,
    userId: payload.userId,
  };

  // Insert note into database
  const [newNote] = await db.insert(notesTable).values(note).returning();

  // Return new note
  return c.json(newNote);
});

// Update a note
noteRoutes.put("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");
  const token = c.req.header("Authorization")?.split(" ")[1];

  // Check if token is present before verifying
  if (!token) return c.json({ error: "Unauthorized" }, 401);

  // Verify token before accessing database
  const payload = (await verify(
    token,
    process.env["JWT_SECRET"]!
  )) as unknown as JWTPayload;

  // Verify note ownership
  const existingNote = await db.query.notesTable.findFirst({
    where: eq(notesTable.id, id),
  });

  // Check if note exists
  if (!existingNote) {
    return c.json({ error: "Note not found" }, 404);
  }

  // Verify ownership
  if (existingNote.userId !== payload.userId) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  // Update note
  const noteData = await c.req.json<UpdateNoteDto>();

  // Create updated note object
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

  // Return updated note
  return c.json(updated);
});

// Delete a note
noteRoutes.delete("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");
  const token = c.req.header("Authorization")?.split(" ")[1];

  // Check if token is present before verifying
  if (!token) return c.json({ error: "Unauthorized" }, 401);

  // Verify token before accessing database
  const payload = (await verify(
    token,
    process.env["JWT_SECRET"]!
  )) as unknown as JWTPayload;

  // Verify note ownership
  const existingNote = await db.query.notesTable.findFirst({
    where: eq(notesTable.id, id),
  });

  // Check if note exists
  if (!existingNote) {
    return c.json({ error: "Note not found" }, 404);
  }

  // Verify ownership
  if (existingNote.userId !== payload.userId) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  // Delete note from database
  await db.delete(notesTable).where(eq(notesTable.id, id));

  // Return success message
  return c.json({ message: `Note ${id} deleted` });
});

// Toggle favorite status
noteRoutes.patch("/:id/favorite", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");
  const token = c.req.header("Authorization")?.split(" ")[1];

  // Check if token is present before verifying
  if (!token) return c.json({ error: "Unauthorized" }, 401);

  // Verify token before accessing database
  const payload = (await verify(
    token,
    process.env["JWT_SECRET"]!
  )) as unknown as JWTPayload;

  // Get current note to toggle its favorite status
  const currentNote = await db.query.notesTable.findFirst({
    where: eq(notesTable.id, id),
  });

  // Check if note exists
  if (!currentNote) {
    return c.json({ error: "Note not found" }, 404);
  }

  // Verify ownership
  if (currentNote.userId !== payload.userId) {
    return c.json({ error: "Unauthorized" }, 403);
  }

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
});

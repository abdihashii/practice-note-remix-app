// Third-party imports
import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";

// Local imports
import { notesTable } from "@/db/schema";
import type { CustomEnv } from "@/types";

export const noteRoutes = new Hono<CustomEnv>();

// Get all notes
noteRoutes.get("/", async (c) => {
  const db = c.get("db");
  const notes = await db
    .select()
    .from(notesTable)
    .orderBy(desc(notesTable.updatedAt));
  return c.json(notes);
});

// Get a note by id
noteRoutes.get("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");
  const note = await db.query.notesTable.findFirst({
    where: eq(notesTable.id, id),
  });
  return c.json(note);
});

// Create a new note
noteRoutes.post("/", async (c) => {
  const db = c.get("db");
  const note = await c.req.json();
  const newNote = await db.insert(notesTable).values(note).returning();
  const createdNote = newNote[0];
  return c.json(createdNote);
});

// Update a note
noteRoutes.put("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");
  const note = await c.req.json();
  const updatedNote = {
    ...note,
    updatedAt: new Date(), // Pass Date object directly instead of ISO string
  };
  await db.update(notesTable).set(updatedNote).where(eq(notesTable.id, id));

  // Fetch and return the updated note
  const updated = await db.query.notesTable.findFirst({
    where: eq(notesTable.id, id),
  });
  return c.json(updated);
});

// Delete a note
noteRoutes.delete("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");
  await db.delete(notesTable).where(eq(notesTable.id, id));
  return c.json({ message: `Note ${id} deleted` });
});

// Toggle favorite status
noteRoutes.patch("/:id/favorite", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  // Get current note to toggle its favorite status
  const currentNote = await db.query.notesTable.findFirst({
    where: eq(notesTable.id, id),
  });

  if (!currentNote) {
    return c.json({ error: "Note not found" }, 404);
  }

  // Toggle the favorite status
  const updatedNote = await db
    .update(notesTable)
    .set({
      favorite: !currentNote.favorite,
      updatedAt: new Date(),
    })
    .where(eq(notesTable.id, id))
    .returning();

  return c.json(updatedNote[0]);
});

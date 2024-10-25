// Third-party imports
import { eq } from "drizzle-orm";
import { Hono } from "hono";

// Local imports
import { notesTable } from "@/db/schema";
import type { CustomEnv } from "@/types";

export const noteRoutes = new Hono<CustomEnv>();

// Get all notes
noteRoutes.get("/", async (c) => {
  const db = c.get("db");
  const notes = await db.select().from(notesTable);
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
  return c.json(newNote);
});

// Update a note
noteRoutes.put("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");
  const note = await c.req.json();
  await db.update(notesTable).set(note).where(eq(notesTable.id, id));
  return c.json({ message: `Note ${id} updated` });
});

// Delete a note
noteRoutes.delete("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");
  await db.delete(notesTable).where(eq(notesTable.id, id));
  return c.json({ message: `Note ${id} deleted` });
});

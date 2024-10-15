// Third-party imports
import { serve } from "@hono/node-server";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";

// Local imports
import { dbConnect } from "./db";
import { notesTable } from "./db/schema";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

async function main() {
  const db = await dbConnect();

  // Get all notes
  app.get("/notes", async (c) => {
    const notes = await db.select().from(notesTable);
    return c.json(notes);
  });

  // Create a new note
  app.post("/notes", async (c) => {
    const note = await c.req.json();
    const newNote = await db.insert(notesTable).values(note).returning();
    return c.json(newNote);
  });

  // Update a note
  app.put("/notes/:id", async (c) => {
    const id = c.req.param("id");
    const note = await c.req.json();
    await db.update(notesTable).set(note).where(eq(notesTable.id, id));
    return c.json({ message: `Note ${id} updated` });
  });

  // Delete a note
  app.delete("/notes/:id", async (c) => {
    const id = c.req.param("id");
    await db.delete(notesTable).where(eq(notesTable.id, id));
    return c.json({ message: `Note ${id} deleted` });
  });

  // Search notes table
  app.get("/search", async (c) => {
    try {
      const searchQuery = c.req.query("q");
      const normalizedSearchQuery = searchQuery
        ? searchQuery.trim().toLowerCase()
        : "";

      let searchResults;

      if (normalizedSearchQuery === "") {
        // Return all notes if the search query is empty
        searchResults = await db.select().from(notesTable);
      } else {
        // Perform search with the given query
        searchResults = await db
          .select()
          .from(notesTable)
          .where(sql`LOWER(title) LIKE ${`%${normalizedSearchQuery}%`}`);
      }

      if (searchResults.length === 0) {
        return c.json({
          error: `No results found for ${searchQuery}`,
          searchResults: [],
        });
      }

      return c.json({
        error: null,
        searchResults,
      });
    } catch (error) {
      console.error("Error in search endpoint:", error);
      return c.json(
        { error: "An unexpected error occurred. Please try again later." },
        500
      );
    }
  });

  serve({
    fetch: app.fetch,
    port: 8000,
    hostname: "0.0.0.0",
  });
  console.log("Server is running on port 8000");
}

main();

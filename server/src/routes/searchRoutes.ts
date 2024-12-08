// Third-party imports
import { sql } from "drizzle-orm";
import { Hono } from "hono";

// Local imports
import { notesTable } from "@/db/schema";
import { CustomEnv } from "@/types";

export const searchRoutes = new Hono<CustomEnv>();

// Search notes table
searchRoutes.get("/", async (c) => {
  try {
    const db = c.get("db");

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

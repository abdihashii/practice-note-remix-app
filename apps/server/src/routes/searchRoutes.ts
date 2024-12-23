// Third-party imports
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";

// Local imports
import { notesTable } from "@/db/schema";
import { verifyJWT } from "@/middleware/authMiddleware";
import { handleAuthError } from "@/middleware/errorMiddleware";
import type { CustomEnv } from "@/types";

export const searchRoutes = new Hono<CustomEnv>();

// Protect all search routes
searchRoutes.use("*", verifyJWT);

// Search notes table
searchRoutes.get("/", async (c) => {
  try {
    const db = c.get("db");
    const userId = c.get("userId");

    const searchQuery = c.req.query("q");
    const normalizedSearchQuery = searchQuery
      ? searchQuery.trim().toLowerCase()
      : "";

    let searchResults;

    if (normalizedSearchQuery === "") {
      // Return all notes if the search query is empty (only user's notes)
      searchResults = await db
        .select()
        .from(notesTable)
        .where(eq(notesTable.userId, userId));
    } else {
      // Perform search with the given query (only user's notes)
      searchResults = await db
        .select()
        .from(notesTable)
        .where(
          sql`LOWER(title) LIKE ${`%${normalizedSearchQuery}%`} AND ${eq(
            notesTable.userId,
            userId
          )}`
        );
    }

    if (searchResults.length === 0) {
      return c.json({
        message: `No results found for "${searchQuery}"`,
        searchResults: [],
      });
    }

    return c.json({
      message: `Found ${searchResults.length} results for "${searchQuery}"`,
      searchResults,
    });
  } catch (err) {
    return handleAuthError(c, "Search operation failed", {
      error: err instanceof Error ? err.message : String(err),
      query: c.req.query("q"),
    });
  }
});

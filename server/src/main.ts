// Third-party imports
import { serve } from "@hono/node-server";
import { eq } from "drizzle-orm";
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

  app.get("/", async (c) => {
    return c.text("Hello, World!");
  });

  app.get("/notes", async (c) => {
    const notes = await db.select().from(notesTable);
    return c.json(notes);
  });

  app.delete("/notes/:id", async (c) => {
    const id = c.req.param("id");
    await db.delete(notesTable).where(eq(notesTable.id, id));
    return c.json({ message: `Note ${id} deleted` });
  });

  serve({
    fetch: app.fetch,
    port: 3000,
  });
  console.log("Server is running on port 3000");
}

main();

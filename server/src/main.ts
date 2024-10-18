// Third-party imports
import { serve } from "@hono/node-server";
import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import { MiddlewareHandler } from "hono/types";

// Local imports
import { dbConnect } from "@/db";
import { noteRoutes } from "@/routes/noteRoutes";
import { searchRoutes } from "@/routes/searchRoutes";
import { CustomEnv } from "@/types";

// Create a new Hono app with the custom environment
const app = new Hono<CustomEnv>();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

async function main() {
  const db = await dbConnect();

  // Middleware to pass the database connection to the routes
  const dbMiddleware: MiddlewareHandler<CustomEnv> = async (c, next) => {
    c.set("db", db);
    await next();
  };
  app.use(dbMiddleware);

  // Mount note routes
  app.route("/notes", noteRoutes);

  // Mount search routes
  app.route("/search", searchRoutes);

  serve({
    fetch: app.fetch,
    port: 8000,
    hostname: "0.0.0.0",
  });
  console.log("Server is running on port 8000");
}

main();

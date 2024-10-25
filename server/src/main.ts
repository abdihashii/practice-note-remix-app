// Third-party imports
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { MiddlewareHandler } from "hono/types";

// Local imports
import { dbConnect } from "@/db";
import { noteRoutes } from "@/routes/noteRoutes";
import { searchRoutes } from "@/routes/searchRoutes";
import type { CustomEnv } from "@/types";

// Create a new Hono app with the custom environment
const app = new Hono<CustomEnv>();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

console.log("Initializing server...");
const db = await dbConnect();
console.log("Database connected successfully");

const dbMiddleware: MiddlewareHandler<CustomEnv> = async (c, next) => {
  try {
    c.set("db", db);
    await next();
  } catch (err) {
    console.error("Middleware error:", err);
    throw err;
  }
};

// Add request logging
app.use("*", async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`);
  try {
    await next();
  } catch (err) {
    console.error("Request error:", err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

app.use(dbMiddleware);

// Mount note routes
app.route("/notes", noteRoutes);

// Mount search routes
app.route("/search", searchRoutes);

// Add basic health check
app.get("/health", (c) => c.json({ status: "ok" }));

// Use Bun's serve instead of node-server
export default {
  port: 8000,
  fetch: app.fetch,
};

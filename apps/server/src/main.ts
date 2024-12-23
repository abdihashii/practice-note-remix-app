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

// Add basic health check before any database operations
app.get("/health", (c) => c.json({ status: "ok" }));

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    exposeHeaders: ["Content-Length", "X-Requested-With"],
    credentials: true,
    maxAge: 600,
  })
);

console.log("Initializing server...");
let dbConnection = null;
try {
  dbConnection = await dbConnect();
  console.log("Database connected successfully");
} catch (err) {
  console.error("Database connection failed:", err);
  console.log("Starting server without database connection...");
}

// Middleware to pass the database connection to the routes
const dbMiddleware: MiddlewareHandler<CustomEnv> = async (c, next) => {
  try {
    if (!dbConnection) {
      return c.json({ error: "Database not available" }, 503);
    }
    c.set("db", dbConnection);
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

// Mount routes with database middleware
app.use("/notes/*", dbMiddleware);
app.use("/search/*", dbMiddleware);

// Mount note routes
app.route("/notes", noteRoutes);

// Mount search routes
app.route("/search", searchRoutes);

// Use Bun's serve instead of node-server
export default {
  port: process.env["PORT"] ? parseInt(process.env["PORT"]) : 8000,
  hostname: "0.0.0.0",
  fetch: app.fetch,
};

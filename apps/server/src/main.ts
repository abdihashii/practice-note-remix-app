// Third-party imports
import { Hono } from "hono";
import type { MiddlewareHandler } from "hono/types";

// Local imports
import { dbConnect } from "@/db";
import { errorHandler } from "@/middleware/errorMiddleware";
import {
  corsMiddleware,
  securityMiddleware,
} from "@/middleware/securityMiddleware";
import { authRoutes } from "@/routes/authRoutes";
import { noteRoutes } from "@/routes/noteRoutes";
import { searchRoutes } from "@/routes/searchRoutes";
import type { CustomEnv } from "@/types";

// Helper function to validate environment variables
function validateEnvironment() {
  const required = ["JWT_SECRET", "DATABASE_URL"];
  if (process.env.NODE_ENV === "production") {
    required.push("APP_URL");
  }

  for (const env of required) {
    if (!process.env[env]) {
      throw new Error(`Missing required environment variable: ${env}`);
    }
  }
}

// Validate environment before app initialization
validateEnvironment();

// Create a new Hono app with the custom environment
const app = new Hono<CustomEnv>();

// Apply error handler first to catch all errors
app.use("*", errorHandler);

// Apply CORS middleware
app.use("*", corsMiddleware);

// Apply all security middleware
securityMiddleware.forEach((middleware) => {
  app.use("*", middleware);
});

console.log("Initializing server...");
const db = await dbConnect();
console.log("Database connected successfully");

// Middleware to pass the database connection to the routes
const dbMiddleware: MiddlewareHandler<CustomEnv> = async (c, next) => {
  try {
    c.set("db", db);
    await next();
  } catch (err) {
    throw err; // Let error handler middleware handle it
  }
};

// Add request logging
app.use("*", async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`);
  try {
    await next();
  } catch (err) {
    throw err; // Let error handler middleware handle it
  }
});

app.use(dbMiddleware);

// Mount auth routes
app.route("/auth", authRoutes);

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

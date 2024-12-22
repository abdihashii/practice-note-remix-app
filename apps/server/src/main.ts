// Third-party imports
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { MiddlewareHandler } from "hono/types";

// Local imports
import { dbConnect } from "@/db";
import {
  csrfMiddleware,
  securityHeadersMiddleware,
} from "@/middleware/authMiddleware";
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

// Apply CORS middleware
app.use(
  "*",
  cors({
    origin: process.env["APP_URL"] ?? "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    exposeHeaders: ["Content-Length", "X-Requested-With", "X-CSRF-Token"],
    credentials: true,
    maxAge: 600,
  })
);

console.log("Initializing server...");
const db = await dbConnect();
console.log("Database connected successfully");

// Middleware to pass the database connection to the routes
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

// Mount auth routes
app.route("/auth", authRoutes);

// Mount note routes
app.route("/notes", noteRoutes);

// Mount search routes
app.route("/search", searchRoutes);

// Add basic health check
app.get("/health", (c) => c.json({ status: "ok" }));

// Add CSRF protection middleware
app.use("*", csrfMiddleware);

// Add security headers middleware
app.use("*", securityHeadersMiddleware);

// Use Bun's serve instead of node-server
export default {
  port: 8000,
  fetch: app.fetch,
};

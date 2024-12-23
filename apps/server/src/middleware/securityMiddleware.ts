// Third-party imports
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";
import type { MiddlewareHandler } from "hono/types";

// Local imports
import type { CustomEnv } from "@/types";

/**
 * CORS middleware configuration
 * Controls which origins can access the API and what methods/headers are allowed
 */
export const corsMiddleware = cors({
  origin:
    process.env.NODE_ENV === "production"
      ? process.env["APP_URL"] || "http://localhost:3000" // Fallback for type safety
      : "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  exposeHeaders: ["Content-Length", "X-Requested-With", "X-CSRF-Token"],
  credentials: true,
  maxAge: 600,
});

/**
 * CSRF protection middleware configuration
 * Helps prevent Cross-Site Request Forgery attacks by requiring a token
 * The token must be included in requests that modify data (POST, PUT, DELETE)
 */
export const csrfMiddleware = csrf({
  origin: process.env["APP_URL"], // Only allow requests from our frontend
});

/**
 * Security headers middleware configuration
 * These HTTP headers help protect against common web vulnerabilities
 */
export const securityHeadersMiddleware = secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"], // Only allow resources from same origin
    scriptSrc: ["'self'"], // Only allow scripts from same origin
    styleSrc: ["'self'"], // Only allow styles from same origin
    imgSrc: ["'self'", "data:", "blob:"], // Allow images from same origin + data/blob URLs
    connectSrc: ["'self'", "ws:", "wss:"], // Allow WebSocket connections
  },
  xFrameOptions: "DENY", // Prevent site from being embedded in iframes
  xContentTypeOptions: "nosniff", // Prevent MIME type sniffing
  referrerPolicy: "strict-origin-when-cross-origin", // Control referrer information
  // Only enable HSTS in production
  ...(process.env.NODE_ENV === "production"
    ? {
        strictTransportSecurity: "max-age=31536000; includeSubDomains", // Require HTTPS
      }
    : {}),
});

/**
 * HTTPS enforcement middleware (only in production)
 * Redirects HTTP requests to HTTPS in production environment
 */
export const httpsEnforcementMiddleware: MiddlewareHandler<CustomEnv> = async (
  c,
  next
) => {
  if (process.env.NODE_ENV === "production") {
    const proto = c.req.header("x-forwarded-proto");
    if (proto && proto !== "https") {
      const url = new URL(c.req.url);
      url.protocol = "https:";
      return c.redirect(url.toString(), 301);
    }
  }
  await next();
};

/**
 * Content type enforcement middleware
 * Ensures proper content types are used for requests
 * Enforces application/json for POST, PUT, PATCH requests
 */
export const contentTypeMiddleware: MiddlewareHandler<CustomEnv> = async (
  c,
  next
) => {
  const contentType = c.req.header("content-type");
  const method = c.req.method;

  // Only check content-type for POST, PUT, PATCH requests
  if (
    ["POST", "PUT", "PATCH"].includes(method) &&
    (!contentType || !contentType.includes("application/json"))
  ) {
    return c.json(
      { error: "Content-Type must be application/json" },
      415 // Unsupported Media Type
    );
  }

  await next();
};

/**
 * Cookie security middleware
 * Sets secure cookie policies including HttpOnly, SameSite, and Secure (in production)
 */
export const cookieMiddleware: MiddlewareHandler<CustomEnv> = async (
  c,
  next
) => {
  // Set secure cookie policy header
  c.header(
    "Set-Cookie",
    `Path=/; ${
      process.env.NODE_ENV === "production" ? "Secure; " : ""
    }HttpOnly; SameSite=Lax`
  );
  await next();
};

/**
 * Combined security middleware
 * Applies all security middleware in the correct order
 */
export const securityMiddleware: MiddlewareHandler<CustomEnv>[] = [
  httpsEnforcementMiddleware,
  contentTypeMiddleware,
  cookieMiddleware,
  securityHeadersMiddleware,
  csrfMiddleware,
];

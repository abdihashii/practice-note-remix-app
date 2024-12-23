// Third-party imports
import { eq } from "drizzle-orm";
import { csrf } from "hono/csrf";
import { verify } from "hono/jwt";
import { secureHeaders } from "hono/secure-headers";
import type { MiddlewareHandler } from "hono/types";

// Local imports
import { usersTable } from "@/db/schema";
import type { CustomEnv } from "@/types";

// CSRF protection middleware configuration
// This helps prevent Cross-Site Request Forgery attacks by requiring a token
// The token must be included in requests that modify data (POST, PUT, DELETE)
export const csrfMiddleware = csrf({
  origin: process.env["APP_URL"], // Only allow requests from our frontend
});

// Security headers middleware configuration
// These HTTP headers help protect against common web vulnerabilities
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
  strictTransportSecurity: "max-age=31536000; includeSubDomains", // Require HTTPS
});

interface CustomJWTPayload {
  userId: string;
  exp: number;
  iat: number;
}

declare module "hono" {
  interface ContextVariableMap {
    userId: string;
  }
}

// JWT verification middleware
export const verifyJWT: MiddlewareHandler<CustomEnv> = async (c, next) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return c.json({ error: "No token provided" }, 401);
    }

    const secret = process.env["JWT_SECRET"];
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    try {
      const decoded = await verify(token, secret);
      const payload = decoded as unknown as CustomJWTPayload;

      if (!payload.userId) {
        return c.json({ error: "Invalid token format" }, 401);
      }

      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        return c.json({ error: "Token expired" }, 401);
      }

      // Add user ID to request context
      c.set("userId", payload.userId);

      // Check if user's tokens were invalidated
      const db = c.get("db");
      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.id, payload.userId),
      });

      if (user?.lastTokenInvalidation) {
        const tokenIssuedAt = payload.iat;
        const invalidationTime = Math.floor(
          user.lastTokenInvalidation.getTime() / 1000
        );

        if (tokenIssuedAt < invalidationTime) {
          return c.json({ error: "Token has been invalidated" }, 401);
        }
      }

      await next();
    } catch (err) {
      console.error("JWT verification error:", err);
      return c.json({ error: "Invalid token" }, 401);
    }
  } catch (err) {
    console.error("Auth middleware error:", err);
    return c.json({ error: "Authentication failed" }, 500);
  }
};

// Third-party imports
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";
import type { MiddlewareHandler } from "hono/types";

// Local imports
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

// JWT verification middleware (to be implemented)
export const verifyJWT: MiddlewareHandler<CustomEnv> = async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return c.json({ error: "No token provided" }, 401);
  }

  // TODO: Implement JWT verification
  await next();
};

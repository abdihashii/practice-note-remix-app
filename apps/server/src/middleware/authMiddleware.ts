// Third-party imports
import { eq } from "drizzle-orm";
import { verify } from "hono/jwt";
import type { MiddlewareHandler } from "hono/types";

// Local imports
import { usersTable } from "@/db/schema";
import type { CustomEnv } from "@/types";

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

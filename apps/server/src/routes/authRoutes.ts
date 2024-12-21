// Third-party imports
import {
  validatePassword,
  type NotificationPreferences,
  type UserSettings,
} from "@notes-app/types";
import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { sign } from "hono/jwt";

// Local imports
import { usersTable } from "@/db/schema";
import type { CustomEnv } from "@/types";
import type { CreateUserDto, User } from "@notes-app/types";

export const authRoutes = new Hono<CustomEnv>();

/**
 * Hash a password using Argon2id (recommended by OWASP)
 * Using recommended settings from: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
 */
async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64MB
    timeCost: 3, // Number of iterations
    parallelism: 4,
  });
}

/**
 * Verify a password against a hash using Argon2id
 */
async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}

/**
 * Generate JWT tokens for authentication
 */
async function generateTokens(userId: string) {
  const secret = process.env["JWT_SECRET"];
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const accessToken = await sign(
    { userId, exp: Math.floor(Date.now() / 1000) + 15 * 60 },
    secret
  );
  const refreshToken = await sign(
    {
      userId,
      type: "refresh",
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    },
    secret
  );

  return { accessToken, refreshToken };
}

function isStrongPassword(password: string): boolean {
  return validatePassword(password).isValid;
}

/**
 * Register a new user
 * POST /auth/register
 */
authRoutes.post("/register", async (c) => {
  try {
    const db = c.get("db");
    const data = await c.req.json<CreateUserDto>();

    // Check if user already exists
    const existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, data.email),
    });

    if (existingUser) {
      return c.json({ error: "Email already registered" }, 400);
    }

    // Check if password is strong
    if (!isStrongPassword(data.password)) {
      const { errors } = validatePassword(data.password);
      return c.json(
        {
          error: "Invalid password",
          details: errors,
        },
        400
      );
    }

    // Hash password using Argon2
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const [user] = await db
      .insert(usersTable)
      .values({
        email: data.email,
        hashedPassword,
        name: data.name,
      })
      .returning();

    if (!user) {
      throw new Error("Failed to create user");
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user.id);

    // Update user with refresh token
    await db
      .update(usersTable)
      .set({
        refreshToken,
        refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        lastSuccessfulLogin: new Date(),
        loginCount: 1,
      })
      .where(eq(usersTable.id, user.id));

    // Return safe user object (excluding sensitive data)
    const safeUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() ?? new Date().toISOString(),
      emailVerified: user.emailVerified ?? false,
      isActive: user.isActive ?? true,
      deletedAt: user.deletedAt?.toISOString() ?? null,
      settings: (user.settings as UserSettings) ?? {
        theme: "system",
        language: "en",
        timezone: "UTC",
      },
      notificationPreferences:
        (user.notificationPreferences as NotificationPreferences) ?? {
          email: {
            enabled: false,
            digest: "never",
            marketing: false,
          },
          push: {
            enabled: false,
            alerts: false,
          },
        },
      lastActivityAt: user.lastActivityAt?.toISOString() ?? null,
      lastSuccessfulLogin: new Date().toISOString(),
      loginCount: 1,
    };

    return c.json({
      user: safeUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return c.json({ error: "Registration failed" }, 500);
  }
});

/**
 * Login user
 * POST /auth/login
 */
authRoutes.post("/login", async (c) => {
  try {
    const db = c.get("db");
    const { email, password } = await c.req.json<{
      email: string;
      password: string;
    }>();

    // Find user
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    if (!user) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // Verify password using Argon2
    const isValidPassword = await verifyPassword(password, user.hashedPassword);
    if (!isValidPassword) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user.id);

    // Update user login info
    await db
      .update(usersTable)
      .set({
        refreshToken,
        refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        lastSuccessfulLogin: new Date(),
        loginCount: (user.loginCount ?? 0) + 1,
        lastActivityAt: new Date(),
      })
      .where(eq(usersTable.id, user.id));

    // Return safe user object
    const safeUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() ?? new Date().toISOString(),
      emailVerified: user.emailVerified ?? false,
      isActive: user.isActive ?? true,
      deletedAt: user.deletedAt?.toISOString() ?? null,
      settings: (user.settings as UserSettings) ?? {
        theme: "system",
        language: "en",
        timezone: "UTC",
      },
      notificationPreferences:
        (user.notificationPreferences as NotificationPreferences) ?? {
          email: {
            enabled: true,
            digest: "daily",
            marketing: false,
          },
          push: {
            enabled: true,
            alerts: true,
          },
        },
      lastActivityAt: new Date().toISOString(),
      lastSuccessfulLogin: new Date().toISOString(),
      loginCount: (user.loginCount ?? 0) + 1,
    };

    return c.json({
      user: safeUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Login failed" }, 500);
  }
});

/**
 * Refresh access token
 * POST /auth/refresh
 */
authRoutes.post("/refresh", async (c) => {
  try {
    const db = c.get("db");
    const { refreshToken } = await c.req.json<{ refreshToken: string }>();

    // Find user with this refresh token
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.refreshToken, refreshToken),
    });

    if (!user || !user.refreshTokenExpiresAt) {
      return c.json({ error: "Invalid refresh token" }, 401);
    }

    // Check if refresh token is expired
    if (user.refreshTokenExpiresAt < new Date()) {
      return c.json({ error: "Refresh token expired" }, 401);
    }

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateTokens(user.id);

    // Update user with new refresh token (rotation)
    await db
      .update(usersTable)
      .set({
        refreshToken: newRefreshToken,
        refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        lastActivityAt: new Date(),
      })
      .where(eq(usersTable.id, user.id));

    return c.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return c.json({ error: "Token refresh failed" }, 500);
  }
});

/**
 * Logout user
 * POST /auth/logout
 */
authRoutes.post("/logout", async (c) => {
  try {
    const db = c.get("db");
    const { refreshToken } = await c.req.json<{ refreshToken: string }>();

    // Clear refresh token from user
    await db
      .update(usersTable)
      .set({
        refreshToken: null,
        refreshTokenExpiresAt: null,
        lastTokenInvalidation: new Date(),
      })
      .where(eq(usersTable.refreshToken, refreshToken));

    return c.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return c.json({ error: "Logout failed" }, 500);
  }
});

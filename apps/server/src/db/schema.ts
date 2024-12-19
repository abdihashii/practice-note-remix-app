import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const notesTable = pgTable("notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  favorite: boolean("favorite").default(false),
});

export const usersTable = pgTable("users", {
  // Core user information
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  hashedPassword: varchar("hashed_password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),

  // JWT management
  refreshToken: text("refresh_token"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
    withTimezone: true,
  }),
  lastTokenInvalidation: timestamp("last_token_invalidation", {
    withTimezone: true,
  }),

  // Email verification
  emailVerified: boolean("email_verified").default(false),
  verificationToken: text("verification_token"),
  verificationTokenExpiry: timestamp("verification_token_expiry", {
    withTimezone: true,
  }),

  // Password reset
  resetToken: text("reset_token"),
  resetTokenExpiresAt: timestamp("reset_token_expires_at", {
    withTimezone: true,
  }),
  lastPasswordChange: timestamp("last_password_change", {
    withTimezone: true,
  }),

  // Account status & management
  isActive: boolean("is_active").default(true),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  settings: jsonb("settings").default({}),
});

// You can add type inference helpers if needed
export type Note = typeof notesTable.$inferSelect;
export type NewNote = typeof notesTable.$inferInsert;
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

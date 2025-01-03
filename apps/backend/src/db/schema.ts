import {
	boolean,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
	jsonb,
	integer,
} from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
	// Core user information
	id: uuid('id').primaryKey().defaultRandom(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	hashedPassword: varchar('hashed_password', { length: 255 }).notNull(),
	name: varchar('name', { length: 255 }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),

	// JWT management
	refreshToken: text('refresh_token'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at', {
		withTimezone: true,
	}),
	lastTokenInvalidation: timestamp('last_token_invalidation', {
		withTimezone: true,
	}),

	// Email verification
	emailVerified: boolean('email_verified').default(false),
	verificationToken: text('verification_token'),
	verificationTokenExpiry: timestamp('verification_token_expiry', {
		withTimezone: true,
	}),

	// Password reset
	resetToken: text('reset_token'),
	resetTokenExpiresAt: timestamp('reset_token_expires_at', {
		withTimezone: true,
	}),
	lastPasswordChange: timestamp('last_password_change', {
		withTimezone: true,
	}),

	// Account status & management
	isActive: boolean('is_active').default(true),
	deletedAt: timestamp('deleted_at', { withTimezone: true }),

	// User preferences & settings
	settings: jsonb('settings').default({
		theme: 'system',
		language: 'en',
		timezone: 'UTC',
	} as Record<string, unknown>),
	notificationPreferences: jsonb('notification_preferences').default({
		email: {
			enabled: true,
			digest: 'daily',
			marketing: false,
		},
		push: {
			enabled: true,
			alerts: true,
		},
	} as Record<string, unknown>),

	// Activity tracking
	lastActivityAt: timestamp('last_activity_at', { withTimezone: true }),
	lastSuccessfulLogin: timestamp('last_successful_login', {
		withTimezone: true,
	}),
	loginCount: integer('login_count').default(0),
});

export const notesTable = pgTable('notes', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		// .notNull()
		.references(() => usersTable.id, {
			onDelete: 'cascade',
		}),
	title: varchar('title', { length: 255 }).notNull(),
	content: text('content'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
	favorite: boolean('favorite').default(false),
});

// User type inference helpers
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

// Note type inference helpers
export type Note = typeof notesTable.$inferSelect;
export type NewNote = typeof notesTable.$inferInsert;

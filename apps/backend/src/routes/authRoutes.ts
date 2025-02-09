// Third-party imports
import type {
	AuthResponse,
	CreateUserDto,
	TokenResponse,
	User,
} from '@notes-app/types';
import {
	validatePasswordStrength,
	type NotificationPreferences,
	type UserSettings,
} from '@notes-app/types';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { sign } from 'hono/jwt';

// Local imports
import { usersTable } from '../db/schema';
import {
	handleAuthError,
	handleCSRFError,
} from '../middleware/errorMiddleware';
import type { CustomEnv } from '../types';

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
	hash: string,
): Promise<boolean> {
	try {
		return await argon2.verify(hash, password);
	} catch (error) {
		console.error('Password verification error:', error);
		return false;
	}
}

/**
 * Generate JWT tokens for authentication
 */
async function generateTokens(userId: string) {
	const secret = process.env['JWT_SECRET'];
	if (!secret) {
		throw new Error('JWT_SECRET is not defined');
	}

	const accessToken = await sign(
		{ userId, exp: Math.floor(Date.now() / 1000) + 15 * 60 },
		secret,
	);
	const refreshToken = await sign(
		{
			userId,
			type: 'refresh',
			exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
		},
		secret,
	);

	return { accessToken, refreshToken };
}

/**
 * Register a new user
 * POST /auth/register
 */
authRoutes.post('/register', async (c) => {
	try {
		const db = c.get('db');
		const data = await c.req.json<CreateUserDto>();

		// Check if user already exists
		const existingUser = await db.query.usersTable.findFirst({
			where: eq(usersTable.email, data.email),
		});

		if (existingUser) {
			return handleAuthError(c, 'Email already registered', {
				email: data.email,
			});
		}

		// Validate password strength
		const passwordValidation = validatePasswordStrength(data.password);
		if (!passwordValidation.isValid) {
			return handleAuthError(c, 'Invalid password', {
				errors: passwordValidation.errors,
			});
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
			throw new Error('Failed to create user');
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

		// Set refresh token as HTTP-only cookie
		setCookie(c, 'refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'Lax',
			path: '/',
			maxAge: 7 * 24 * 60 * 60,
			...(process.env.NODE_ENV === 'production' && {
				prefix: 'host',
			}),
		});

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
				theme: 'system',
				language: 'en',
				timezone: 'UTC',
			},
			notificationPreferences:
				(user.notificationPreferences as NotificationPreferences) ?? {
					email: {
						enabled: false,
						digest: 'never',
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

		// Return safe user object and access token
		const authResponse: AuthResponse = {
			user: safeUser,
			accessToken,
		};

		return c.json(authResponse);
	} catch (error) {
		if (error instanceof HTTPException && error.status === 403) {
			return handleCSRFError(c, 'Invalid or missing CSRF token');
		}
		return handleAuthError(c, 'Registration failed', {
			error: error instanceof Error ? error.message : String(error),
		});
	}
});

/**
 * Login user
 * POST /auth/login
 */
authRoutes.post('/login', async (c) => {
	try {
		const db = c.get('db');
		const { email, password } = await c.req.json<{
			email: string;
			password: string;
		}>();

		// Find user
		const user = await db.query.usersTable.findFirst({
			where: eq(usersTable.email, email),
		});

		if (!user) {
			return handleAuthError(c, 'Invalid credentials');
		}

		// Verify password using Argon2
		const isValidPassword = await verifyPassword(password, user.hashedPassword);
		if (!isValidPassword) {
			return handleAuthError(c, 'Invalid credentials');
		}

		// Generate tokens
		const { accessToken, refreshToken } = await generateTokens(user.id);

		// Update user login info in database
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

		// Set refresh token as HTTP-only cookie
		setCookie(c, 'refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production', // true in production
			sameSite: 'Lax', // or 'Strict' if not dealing with third-party redirects
			path: '/',
			maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
			// Optional: Use __Host- prefix for additional security in production
			...(process.env.NODE_ENV === 'production' && {
				prefix: 'host', // This will prefix the cookie with __Host-
			}),
		});

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
				theme: 'system',
				language: 'en',
				timezone: 'UTC',
			},
			notificationPreferences:
				(user.notificationPreferences as NotificationPreferences) ?? {
					email: {
						enabled: true,
						digest: 'daily',
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

		// Return safe user object and access token
		const authResponse: AuthResponse = {
			user: safeUser,
			accessToken,
		};

		return c.json(authResponse);
	} catch (error) {
		if (error instanceof HTTPException && error.status === 403) {
			return handleCSRFError(c, 'Invalid or missing CSRF token');
		}
		return handleAuthError(c, 'Login failed', {
			error: error instanceof Error ? error.message : String(error),
		});
	}
});

/**
 * Refresh access token
 * POST /auth/refresh
 */
authRoutes.post('/refresh', async (c) => {
	try {
		const db = c.get('db');
		// Get refresh token from cookie
		const refreshToken = getCookie(c, 'refreshToken');

		// If no refresh token in cookie, return error
		if (!refreshToken) {
			return handleAuthError(c, 'No refresh token provided');
		}

		// Find user with this refresh token
		const user = await db.query.usersTable.findFirst({
			where: eq(usersTable.refreshToken, refreshToken),
		});

		if (!user || !user.refreshTokenExpiresAt) {
			return handleAuthError(c, 'Invalid refresh token');
		}

		// Check if refresh token is expired
		if (user.refreshTokenExpiresAt < new Date()) {
			return handleAuthError(c, 'Refresh token expired', {
				expiredAt: user.refreshTokenExpiresAt.toISOString(),
			});
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

		// Set new refresh token cookie
		setCookie(c, 'refreshToken', newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production', // true in production
			sameSite: 'Lax', // or 'Strict' if not dealing with third-party redirects
			path: '/',
			maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
			// Optional: Use __Host- prefix for additional security in production
			...(process.env.NODE_ENV === 'production' && {
				prefix: 'host', // This will prefix the cookie with __Host-
			}),
		});

		const tokenResponse: TokenResponse = {
			accessToken: newAccessToken,
		};

		return c.json(tokenResponse);
	} catch (error) {
		if (error instanceof HTTPException && error.status === 403) {
			return handleCSRFError(c, 'Invalid or missing CSRF token');
		}
		return handleAuthError(c, 'Token refresh failed', {
			error: error instanceof Error ? error.message : String(error),
		});
	}
});

/**
 * Logout user
 * POST /auth/logout
 */
authRoutes.post('/logout', async (c) => {
	try {
		const db = c.get('db');
		const { refreshToken } = await c.req.json<{ refreshToken: string }>();

		// Clear refresh token and invalidate all current sessions
		await db
			.update(usersTable)
			.set({
				refreshToken: null,
				refreshTokenExpiresAt: null,
				lastTokenInvalidation: new Date(),
			})
			.where(eq(usersTable.refreshToken, refreshToken));

		return c.json({ message: 'Logged out successfully' });
	} catch (error) {
		if (error instanceof HTTPException && error.status === 403) {
			return handleCSRFError(c, 'Invalid or missing CSRF token');
		}
		return handleAuthError(c, 'Logout failed', {
			error: error instanceof Error ? error.message : String(error),
		});
	}
});

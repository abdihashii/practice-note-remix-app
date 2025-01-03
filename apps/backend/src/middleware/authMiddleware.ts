// Third-party imports
import { eq } from 'drizzle-orm';
import { verify } from 'hono/jwt';
import type { MiddlewareHandler } from 'hono/types';

// Local imports
import { usersTable } from '../db/schema';
import type { CustomEnv } from '../types';
import { handleAuthError, handleTokenError } from './errorMiddleware';

interface CustomJWTPayload {
	userId: string;
	exp: number;
	iat: number;
}

declare module 'hono' {
	interface ContextVariableMap {
		userId: string;
	}
}

// JWT verification middleware
export const verifyJWT: MiddlewareHandler<CustomEnv> = async (c, next) => {
	try {
		const token = c.req.header('Authorization')?.split(' ')[1];
		if (!token) {
			return handleAuthError(c, 'No token provided');
		}

		const secret = process.env['JWT_SECRET'];
		if (!secret) {
			throw new Error('JWT_SECRET is not defined');
		}

		try {
			const decoded = await verify(token, secret);
			const payload = decoded as unknown as CustomJWTPayload;

			if (!payload.userId) {
				return handleTokenError(c, 'Invalid token format');
			}

			// Check if token is expired
			const now = Math.floor(Date.now() / 1000);
			if (payload.exp < now) {
				return handleTokenError(c, 'Token expired');
			}

			// Add user ID to request context
			c.set('userId', payload.userId);

			// Check if user's tokens were invalidated
			const db = c.get('db');
			const user = await db.query.usersTable.findFirst({
				where: eq(usersTable.id, payload.userId),
			});

			if (user?.lastTokenInvalidation) {
				const tokenIssuedAt = payload.iat;
				const invalidationTime = Math.floor(
					user.lastTokenInvalidation.getTime() / 1000,
				);

				if (tokenIssuedAt < invalidationTime) {
					return handleTokenError(c, 'Token has been invalidated', {
						invalidatedAt: user.lastTokenInvalidation.toISOString(),
					});
				}
			}

			await next();
		} catch (err) {
			console.error('JWT verification error:', err);
			return handleTokenError(c, 'Invalid token', {
				error: err instanceof Error ? err.message : String(err),
			});
		}
	} catch (err) {
		console.error('Auth middleware error:', err);
		return handleAuthError(c, 'Authentication failed', {
			error: err instanceof Error ? err.message : String(err),
		});
	}
};

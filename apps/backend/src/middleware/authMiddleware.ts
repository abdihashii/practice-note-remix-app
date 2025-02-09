// Third-party imports
import { SecurityErrorType } from '@notes-app/types';
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
			return handleAuthError(c, 'Authentication required');
		}

		const secret = process.env['JWT_SECRET'];
		if (!secret) {
			throw new Error('Configuration error');
		}

		try {
			const decoded = await verify(token, secret);
			const payload = decoded as unknown as CustomJWTPayload;

			if (!payload.userId) {
				return handleTokenError(c, 'Authentication failed', {
					type: SecurityErrorType.INVALID_TOKEN,
				});
			}

			// Check if token is expired
			const now = Math.floor(Date.now() / 1000);
			if (payload.exp < now) {
				return handleTokenError(c, 'Authentication failed', {
					type: SecurityErrorType.TOKEN_EXPIRED,
				});
			}

			// Add user ID to request context
			c.set('userId', payload.userId);

			// Check if user exists and is active
			const db = c.get('db');
			const user = await db.query.usersTable.findFirst({
				where: eq(usersTable.id, payload.userId),
			});

			if (!user) {
				console.log('[verifyJWT] User not found:', payload.userId);
				return handleAuthError(c, 'User not found');
			}

			if (!user.isActive) {
				console.log('[verifyJWT] User is not active:', payload.userId);
				return handleAuthError(c, 'User account is not active');
			}

			// Check if user's tokens were invalidated
			if (user.lastTokenInvalidation) {
				const tokenIssuedAt = payload.iat;
				const invalidationTime = Math.floor(
					user.lastTokenInvalidation.getTime() / 1000,
				);

				if (tokenIssuedAt < invalidationTime) {
					console.log('[verifyJWT] Token invalidated:', {
						issuedAt: tokenIssuedAt,
						invalidatedAt: invalidationTime,
					});
					return handleTokenError(c, 'Token has been invalidated', {
						type: SecurityErrorType.INVALID_TOKEN,
						tokenType: 'access',
						reason: 'Token was invalidated due to security event',
					});
				}
			}

			await next();
		} catch (err) {
			console.error('[verifyJWT] JWT verification error:', err);
			return handleTokenError(c, 'Authentication failed', {
				type: SecurityErrorType.INVALID_TOKEN,
			});
		}
	} catch (err) {
		console.error('[verifyJWT] Auth middleware error:', err);
		return handleAuthError(c, 'Authentication failed');
	}
};

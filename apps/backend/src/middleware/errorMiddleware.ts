// Third-party imports
import {
	SecurityErrorType,
	type AuthenticationError,
	type AuthorizationError,
	type ErrorResponse,
	type ResourceError,
	type TokenError,
	type ValidationError,
} from '@notes-app/types';
import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { MiddlewareHandler } from 'hono/types';

// Local imports
import type { CustomEnv } from '../types';

// Security event logger
export class SecurityLogger {
	static log(
		context: Context,
		type: SecurityErrorType,
		message: string,
		details?: Record<string, unknown>,
	) {
		const event = {
			type,
			message,
			timestamp: new Date().toISOString(),
			requestId: context.req.header('x-request-id'),
			ip:
				context.req.header('x-forwarded-for') ||
				context.req.header('x-real-ip'),
			userAgent: context.req.header('user-agent'),
			method: context.req.method,
			path: context.req.path,
			details,
		};

		// In production, you might want to send this to a logging service
		if (process.env.NODE_ENV === 'production') {
			// TODO: Implement production logging service
			// Example: await logstashClient.send(event);
		}

		// Console log for development and as backup in production
		console.error('[Security Event]', JSON.stringify(event, null, 2));
	}
}

// Create standardized error response
function createErrorResponse(
	type: SecurityErrorType,
	message: string,
	code: number,
	context: Context,
	options?: {
		details?: Record<string, unknown>;
		validationErrors?: ValidationError[];
		resourceError?: ResourceError;
		authError?: AuthenticationError | AuthorizationError;
		tokenError?: TokenError;
	},
): ErrorResponse {
	const response: ErrorResponse = {
		error: {
			type,
			message,
			code,
			timestamp: new Date().toISOString(),
			requestId: context.req.header('x-request-id'),
		},
	};

	if (options) {
		const { details, validationErrors, resourceError, authError, tokenError } =
			options;
		if (details) response.error.details = details;
		if (validationErrors) response.error.validationErrors = validationErrors;
		if (resourceError) response.error.resourceError = resourceError;
		if (authError) response.error.authError = authError;
		if (tokenError) response.error.tokenError = tokenError;
	}

	return response;
}

// Error handler middleware
export const errorHandler: MiddlewareHandler<CustomEnv> = async (c, next) => {
	try {
		await next();
	} catch (error) {
		console.error('Error caught in middleware:', error);

		let errorResponse: ErrorResponse;
		let statusCode = 500;

		if (error instanceof HTTPException) {
			// Handle Hono HTTP exceptions
			const type = mapHttpStatusToErrorType(error.status);
			statusCode = error.status;
			errorResponse = createErrorResponse(type, error.message, statusCode, c);
			SecurityLogger.log(c, type, error.message);
		} else if (error instanceof Error) {
			const { type, status, details } = categorizeError(error);
			statusCode = status;
			errorResponse = createErrorResponse(
				type,
				error.message,
				status,
				c,
				details,
			);
			SecurityLogger.log(c, type, error.message, details);
		} else {
			// Handle unknown errors
			errorResponse = createErrorResponse(
				SecurityErrorType.SERVER_ERROR,
				'An unexpected error occurred',
				statusCode,
				c,
			);

			SecurityLogger.log(
				c,
				SecurityErrorType.SERVER_ERROR,
				'Unknown error type encountered',
				{ error: String(error) },
			);
		}

		// Set security headers for error responses
		c.header('X-Content-Type-Options', 'nosniff');
		c.header('X-Frame-Options', 'DENY');

		return c.json(errorResponse);
	}
};

// Map HTTP status codes to error types
function mapHttpStatusToErrorType(status: number): SecurityErrorType {
	switch (status) {
		case 400:
			return SecurityErrorType.INVALID_INPUT;
		case 401:
			return SecurityErrorType.AUTHENTICATION;
		case 403:
			return SecurityErrorType.AUTHORIZATION;
		case 404:
			return SecurityErrorType.RESOURCE_NOT_FOUND;
		case 409:
			return SecurityErrorType.RESOURCE_CONFLICT;
		case 422:
			return SecurityErrorType.VALIDATION;
		default:
			return SecurityErrorType.SERVER_ERROR;
	}
}

// Categorize errors and extract relevant details
function categorizeError(error: Error): {
	type: SecurityErrorType;
	status: number;
	details?: {
		details?: Record<string, unknown>;
		validationErrors?: ValidationError[];
		resourceError?: ResourceError;
		authError?: AuthenticationError | AuthorizationError;
		tokenError?: TokenError;
	};
} {
	const message = error.message.toLowerCase();

	// Token-related errors
	if (message.includes('token')) {
		if (message.includes('expired')) {
			return {
				type: SecurityErrorType.TOKEN_EXPIRED,
				status: 401,
				details: {
					tokenError: {
						tokenType: message.includes('refresh') ? 'refresh' : 'access',
						reason: 'Token has expired',
					},
				},
			};
		}
		if (message.includes('invalid')) {
			return {
				type: SecurityErrorType.INVALID_TOKEN,
				status: 401,
				details: {
					tokenError: {
						tokenType: message.includes('refresh') ? 'refresh' : 'access',
						reason: 'Token is invalid',
					},
				},
			};
		}
	}

	// Authentication errors
	if (message.includes('credentials')) {
		return {
			type: SecurityErrorType.INVALID_CREDENTIALS,
			status: 401,
			details: {
				authError: {
					reason: 'Invalid credentials provided',
				},
			},
		};
	}

	// Authorization errors
	if (message.includes('permission') || message.includes('unauthorized')) {
		return {
			type: SecurityErrorType.INSUFFICIENT_PERMISSIONS,
			status: 403,
			details: {
				authError: {
					reason: 'Insufficient permissions for this operation',
				},
			},
		};
	}

	// CSRF errors
	if (message.includes('csrf')) {
		return {
			type: message.includes('missing')
				? SecurityErrorType.MISSING_CSRF_TOKEN
				: SecurityErrorType.INVALID_CSRF_TOKEN,
			status: 403,
		};
	}

	// Validation errors
	if (message.includes('validation') || message.includes('invalid')) {
		return {
			type: SecurityErrorType.VALIDATION,
			status: 422,
			details: {
				validationErrors: [
					{
						field: 'unknown',
						message: error.message,
						code: 'VALIDATION_ERROR',
					},
				],
			},
		};
	}

	// Resource errors
	if (message.includes('not found')) {
		return {
			type: SecurityErrorType.RESOURCE_NOT_FOUND,
			status: 404,
			details: {
				resourceError: {
					resourceType: 'unknown',
					operation: 'read',
					reason: 'Resource not found',
				},
			},
		};
	}

	// Default to server error
	return {
		type: SecurityErrorType.SERVER_ERROR,
		status: 500,
		details:
			process.env.NODE_ENV === 'development'
				? { details: { stack: error.stack } }
				: undefined,
	};
}

// Authentication error handler
export function handleAuthError(
	c: Context,
	message: string,
	details?: Record<string, unknown>,
) {
	const errorResponse = createErrorResponse(
		SecurityErrorType.AUTHENTICATION,
		message,
		401,
		c,
		{
			authError: {
				reason: message,
			},
			details,
		},
	);

	SecurityLogger.log(c, SecurityErrorType.AUTHENTICATION, message, details);
	c.status(401);
	return c.json(errorResponse);
}

// Authorization error handler
export function handleAuthzError(
	c: Context,
	message: string,
	details?: Record<string, unknown>,
) {
	const errorResponse = createErrorResponse(
		SecurityErrorType.AUTHORIZATION,
		message,
		403,
		c,
		{
			authError: {
				reason: message,
			},
			details,
		},
	);

	SecurityLogger.log(c, SecurityErrorType.AUTHORIZATION, message, details);
	c.status(403);
	return c.json(errorResponse);
}

// Token error handler
export function handleTokenError(
	c: Context,
	message: string,
	details?: Record<string, unknown>,
) {
	const errorResponse = createErrorResponse(
		SecurityErrorType.INVALID_TOKEN,
		message,
		401,
		c,
		{
			tokenError: {
				tokenType: 'access',
				reason: message,
			},
			details,
		},
	);

	SecurityLogger.log(c, SecurityErrorType.INVALID_TOKEN, message, details);
	c.status(401);
	return c.json(errorResponse);
}

// CSRF error handler
export function handleCSRFError(
	c: Context,
	message: string,
	details?: Record<string, unknown>,
) {
	const errorResponse = createErrorResponse(
		SecurityErrorType.CSRF,
		message,
		403,
		c,
		{
			details,
		},
	);

	SecurityLogger.log(c, SecurityErrorType.CSRF, message, details);
	c.status(403);
	return c.json(errorResponse);
}

// Validation error handler
export function handleValidationError(
	c: Context,
	message: string,
	validationErrors: ValidationError[],
) {
	const errorResponse = createErrorResponse(
		SecurityErrorType.VALIDATION,
		message,
		422,
		c,
		{
			validationErrors,
		},
	);

	SecurityLogger.log(c, SecurityErrorType.VALIDATION, message, {
		validationErrors,
	});
	c.status(422);
	return c.json(errorResponse);
}

// Resource error handler
export function handleResourceError(
	c: Context,
	message: string,
	resourceError: ResourceError,
) {
	const errorResponse = createErrorResponse(
		SecurityErrorType.RESOURCE,
		message,
		404,
		c,
		{
			resourceError,
		},
	);

	SecurityLogger.log(c, SecurityErrorType.RESOURCE, message, { resourceError });
	return c.json(errorResponse);
}

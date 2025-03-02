// Third-party imports
import { Hono } from 'hono';

// Local imports
import { dbConnect } from './db';
import { notesTable } from './db/schema';
import { verifyJWT } from './middleware/authMiddleware';
import { dbMiddleware } from './middleware/dbMiddleware';
import { errorHandler } from './middleware/errorMiddleware';
import {
	corsMiddleware,
	securityMiddleware,
} from './middleware/securityMiddleware';
import { authRoutes } from './routes/authRoutes';
import { noteRoutes } from './routes/noteRoutes';
import { searchRoutes } from './routes/searchRoutes';
import { CustomEnv } from './types';
import { getEnv, validateEnv } from './utils/env';

// Initialize Hono app with type definitions
const app = new Hono<CustomEnv>();

// Apply CORS middleware first to handle preflight requests
app.use('*', corsMiddleware);

// Apply error handler to catch all errors
app.use('*', errorHandler);

// Apply all security middleware
// (i.e. HTTPS, Content-Type, Cookie, Security Headers, and CSRF)
securityMiddleware.forEach((middleware) => {
	app.use('*', middleware);
});

// Add request logging
app.use('*', async (c, next) => {
	console.log(`${c.req.method} ${c.req.url}`);
	try {
		await next();
	} catch (err) {
		throw err; // Let error handler middleware handle it
	}
});

// Basic health check
app.get('/health', (c) =>
	c.json({
		status: 'ok',
		timestamp: new Date().toISOString(),
	}),
);

// Database health check
app.get('/health/db', async (c) => {
	try {
		const env = getEnv();
		validateEnv();

		const client = await dbConnect();

		// Try to execute a simple query
		const result = await client.select().from(notesTable).limit(1);

		return c.json({
			status: 'ok',
			timestamp: new Date().toISOString(),
			database: {
				connected: true,
				message: 'Database connection successful',
			},
		});
	} catch (error) {
		return c.json(
			{
				status: 'error',
				timestamp: new Date().toISOString(),
				database: {
					connected: false,
					message: 'Database connection failed',
					error: error instanceof Error ? error.message : 'Unknown error',
				},
			},
			503,
		);
	}
});

// Initialize API router with versioning
const api = new Hono<CustomEnv>();

// Apply database middleware to all API routes
api.use('*', dbMiddleware);

// Mount auth routes first (unprotected)
api.route('/auth', authRoutes);

// Apply JWT verification to all other API routes
api.use('*', verifyJWT);

// Mount protected API routes
api.route('/notes', noteRoutes);
api.route('/search', searchRoutes);

// Mount versioned API under /api/v1
app.route('/api/v1', api);

export default app;

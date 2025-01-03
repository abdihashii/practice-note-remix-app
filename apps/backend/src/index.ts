// Third-party imports
import { Hono } from 'hono';

// Local imports
import { dbConnect } from './db';
import { notesTable } from './db/schema';
import { dbMiddleware } from './middleware/dbMiddleware';
import { errorHandler } from './middleware/errorMiddleware';
import {
	corsMiddleware,
	securityMiddleware,
} from './middleware/securityMiddleware';
import { noteRoutes } from './routes/noteRoutes';
import { searchRoutes } from './routes/searchRoutes';
import { authRoutes } from './routes/authRoutes';
import { CustomEnv } from './types';
import { getEnv, validateEnv } from './utils/env';

// Initialize Hono app with type definitions
const app = new Hono<CustomEnv>();

// Apply error handler first to catch all errors
app.use('*', errorHandler);

// Apply CORS middleware
app.use('*', corsMiddleware);

// Apply all security middleware
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
		validateEnv(env);

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

// Mount API routes
api.route('/notes', noteRoutes);
api.route('/search', searchRoutes);
api.route('/auth', authRoutes);

// Mount versioned API under /api/v1
app.route('/api/v1', api);

export default app;

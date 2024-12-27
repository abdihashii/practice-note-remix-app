// Third-party imports
import { neon } from '@neondatabase/serverless';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

// Local imports
import { dbMiddleware } from './middleware/dbMiddleware';
import { noteRoutes } from './routes/noteRoutes';
import { searchRoutes } from './routes/searchRoutes';
import { Env, Variables } from './types';

const isProd = process.env.NODE_ENV === 'production';

// Initialize Hono app with type definitions
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// Configure global CORS middleware
app.use(
	'*',
	cors({
		origin: (origin) => {
			// In development, allow localhost URLs
			if (!isProd) {
				return origin;
			}

			// In production, check against allowed domains
			const allowedOrigins = [
				process.env.FRONTEND_URL,
				// Add any additional production domains here
			].filter(Boolean) as string[];

			return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
		},
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
		allowHeaders: ['Content-Type'],
		exposeHeaders: ['Content-Length', 'X-Requested-With'],
		credentials: true,
		maxAge: 600,
	}),
);

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
		const client = neon(c.env.DATABASE_URL);

		// Try to execute a simple query
		const result = await client`SELECT 1`;

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
		); // Service Unavailable
	}
});

// Initialize API router with versioning
const api = new Hono<{ Bindings: Env; Variables: Variables }>();

// Inject database connection into context
api.use('/notes/*', dbMiddleware);
api.use('/search/*', dbMiddleware);

// Mount API routes
api.route('/notes', noteRoutes);
api.route('/search', searchRoutes);

// Mount versioned API under /api/v1
app.route('/api/v1', api);

export default app;

// Third-party imports
import { Hono } from 'hono';
import { cors } from 'hono/cors';

// Local imports
import { dbMiddleware } from './middleware/dbMiddleware';
import { noteRoutes } from './routes/noteRoutes';
import { Env, Variables } from './types';

const isProd = process.env.NODE_ENV === 'production';

// Initialize Hono app with type definitions
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// Configure global CORS middleware
app.use(
	'*',
	cors({
		origin: isProd ? [process.env['FRONTEND_URL'] ?? 'http://localhost:5173'] : '*',
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
		allowHeaders: ['Content-Type'],
		exposeHeaders: ['Content-Length', 'X-Requested-With'],
		credentials: true,
		maxAge: 600,
	}),
);

// Health check
app.get('/health', (c) =>
	c.json({
		status: 'ok',
		timestamp: new Date().toISOString(),
	}),
);

// Initialize API router with versioning
const api = new Hono<{ Bindings: Env; Variables: Variables }>();

// Inject database connection into context
api.use('/notes/*', dbMiddleware);

// Mount API routes
api.route('/notes', noteRoutes);

// Mount versioned API under /api/v1
app.route('/api/v1', api);

export default app;

// Third-party imports
import { Hono } from 'hono';

// Local imports
import { dbMiddleware } from './middleware/dbMiddleware';
import { noteRoutes } from './routes/noteRoutes';
import { Env, Variables } from './types';

// Create app with both Bindings and Variables types
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Test endpoint
app.get('/', (c) => c.text('Hello World!'));

// Inject the db into the context for all routes that need it
app.use('/notes/*', dbMiddleware);

// Mount note routes
app.route('/notes', noteRoutes);

export default app;

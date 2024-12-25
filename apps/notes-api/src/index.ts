import { Hono } from 'hono';

import { products } from './db/schema';
import { dbMiddleware } from './middleware/dbMiddleware';
import { Env, Variables } from './types';

// Create app with both Bindings and Variables types
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Test endpoint
app.get('/', (c) => c.text('Hello World!'));

// Inject the db into the context for all routes
app.use('*', dbMiddleware);

// Get all products
app.get('/products', async (c) => {
	const db = c.get('db');
	const allProducts = await db.select().from(products);

	return c.json(allProducts);
});

export default app;

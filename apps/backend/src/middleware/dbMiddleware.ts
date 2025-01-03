import { dbConnect } from '../db';
import { MiddlewareHandler } from 'hono';
import { CustomEnv } from '../types';

// Create the middleware handler with proper typing
export const dbMiddleware: MiddlewareHandler<CustomEnv> = async (c, next) => {
	try {
		const db = await dbConnect();
		c.set('db', db);
		await next();
	} catch (error) {
		return c.json({ error: 'Failed to connect to database' }, 500);
	}
};

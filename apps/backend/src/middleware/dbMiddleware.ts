import { dbConnect } from '../db';
import { MiddlewareHandler } from 'hono';

import { Variables } from '../types';
import { getEnv, validateEnv } from '../utils/env';

// Create the middleware handler with proper typing
export const dbMiddleware: MiddlewareHandler<{
	Variables: Variables;
}> = async (c, next) => {
	try {
		const db = await dbConnect();
		c.set('db', db);
		await next();
	} catch (error) {
		return c.json({ error: 'Failed to connect to database' }, 500);
	}
};

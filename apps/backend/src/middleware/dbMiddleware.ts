import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { MiddlewareHandler } from 'hono';

import { Variables } from '../types';
import { getEnv, validateEnv } from '../utils/env';

// Create the middleware handler with proper typing
export const dbMiddleware: MiddlewareHandler<{
	Variables: Variables;
}> = async (c, next) => {
	const env = getEnv();
	validateEnv(env);

	const sql = neon(env.DATABASE_URL);
	const db = drizzle(sql);
	c.set('db', db);
	await next();
};

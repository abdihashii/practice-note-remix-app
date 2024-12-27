import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { MiddlewareHandler } from 'hono';

import { Env, Variables } from '../types';

// Create the middleware handler with proper typing
export const dbMiddleware: MiddlewareHandler<{
	Bindings: Env;
	Variables: Variables;
}> = async (c, next) => {
	const sql = neon(c.env.DATABASE_URL);
	const db = drizzle(sql);
	c.set('db', db);
	await next();
};

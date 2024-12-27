import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Export a function that takes env as a parameter
export function createDb(env: any) {
	const sql = neon(env.DATABASE_URL);
	return drizzle({ client: sql });
}

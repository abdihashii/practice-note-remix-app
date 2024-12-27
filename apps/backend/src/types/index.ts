import { drizzle } from 'drizzle-orm/neon-http';

export type Variables = {
	db: ReturnType<typeof drizzle>;
};

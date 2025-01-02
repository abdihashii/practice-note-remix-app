import { drizzle } from 'drizzle-orm/node-postgres';

export type Variables = {
	db: ReturnType<typeof drizzle>;
};

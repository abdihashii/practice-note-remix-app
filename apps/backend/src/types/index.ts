import { drizzle } from 'drizzle-orm/neon-http';

export type Env = {
	DATABASE_URL: string;
	NODE_ENV?: string;
	FRONTEND_URL?: string;
};

export type Variables = {
	db: ReturnType<typeof drizzle>;
};

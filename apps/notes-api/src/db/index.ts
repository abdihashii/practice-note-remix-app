import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import dotenv from 'dotenv';

const isProduction = process.env.NODE_ENV === 'production';

dotenv.config({
	path: isProduction ? '.dev.vars' : '.env',
});

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL is not set');
}

// Configure postgres client for Supabase with Cloudflare Workers
const client = postgres(connectionString, {
	ssl: 'require',
	prepare: false,
});

export const db = drizzle(client);

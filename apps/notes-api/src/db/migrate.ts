import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import dotenv from 'dotenv';

const isProduction = process.env.NODE_ENV === 'production';

dotenv.config({
	path: isProduction ? '.dev.vars' : '.env',
});

const databaseUrl = process.env.DATABASE_URL;

async function runMigrations() {
	if (!databaseUrl) {
		throw new Error('DATABASE_URL is not set');
	}

	const client = postgres(databaseUrl, { ssl: 'require' });
	const db = drizzle(client);

	console.log('Running migrations...');

	await migrate(db, { migrationsFolder: 'drizzle' });

	console.log('Migrations complete!');

	await client.end();
}

runMigrations().catch(console.error);

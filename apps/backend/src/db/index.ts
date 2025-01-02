/**
 * Database Connection Module
 *
 * Establishes and manages PostgreSQL database connections using connection pooling.
 * This module:
 * - Creates a connection pool for better performance and resource management
 * - Configures connection timeouts and error handling
 * - Initializes Drizzle ORM with the database schema
 * - Provides a single connection point for the entire application
 */

// Third-party imports
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Local imports
import * as schema from './schema';

// Export a function that takes env as a parameter
// export function createDb(env: any) {
// 	const sql = neon(env.DATABASE_URL);
// 	return drizzle({ client: sql });
// }

const databaseUrl = process.env.DATABASE_URL;

export async function dbConnect() {
	if (!process.env.DATABASE_URL) {
		throw new Error('DATABASE_URL is not set');
	}

	// Log connection attempt (hiding sensitive credentials)
	console.log('Connecting to database...');
	console.log('Database URL:', databaseUrl?.replace(/:[^:@]+@/, ':***@'));

	// Initialize connection pool with configuration
	const pool = new Pool({
		connectionString: databaseUrl,
		max: 10, // Maximum number of clients in the pool
		idleTimeoutMillis: 30_000, // Close idle clients after 30 seconds
		connectionTimeoutMillis: 5_000, // Fail if connection takes longer than 5 seconds
	});

	// Handle errors on idle clients to prevent crashes
	pool.on('error', (err) => {
		console.error('Unexpected error on idle client', err);
	});

	try {
		// Test the connection by attempting to connect
		await pool.connect();
		console.log('Successfully connected to database');

		// Initialize and return Drizzle ORM instance
		// This wraps the pool with Drizzle's query builder and schema
		return drizzle(pool, { schema });
	} catch (error) {
		// Log any connection errors and rethrow
		console.error('Failed to connect to database', error);
		throw error;
	}
}

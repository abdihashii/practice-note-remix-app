import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

export default defineConfig({
	out: './drizzle',
	schema: './src/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: 'postgresql://notes-db_owner:ewtTvc6rW8oP@ep-snowy-dawn-a5mcju3z-pooler.us-east-2.aws.neon.tech/notes-db?sslmode=require',
	},
});

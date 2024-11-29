import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";

import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DB_URL;

async function runMigrations() {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = new Client({
    connectionString: databaseUrl,
  });

  await client.connect();
  const db = drizzle(client);

  console.log("Running migrations...");

  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Migrations complete!");

  await client.end();
}

runMigrations().catch(console.error);

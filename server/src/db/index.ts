import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import dotenv from "dotenv";
import { notesTable } from "./schema";

dotenv.config();

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgres://myuser:mypassword@postgres:5432/mydatabase";

export async function dbConnect() {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = new Client({
    connectionString: databaseUrl,
  });

  await client.connect();

  return drizzle(client, { schema: { notesTable } });
}

import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import dotenv from "dotenv";
import { notesTable } from "./schema";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

export async function dbConnect() {
  console.log("Attempting database connection...");
  try {
    const client = new Client({
      connectionString: databaseUrl,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    });

    await client.connect();
    console.log("Database connected successfully");

    return drizzle(client, { schema: { notesTable } });
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

import { drizzle } from "drizzle-orm/connect";
import { load } from "@std/dotenv";

await load({ export: true });

const databaseUrl = Deno.env.get("DATABASE_URL");

export async function connect() {
  const db = await drizzle("node-postgres", databaseUrl!);
  return db;
}

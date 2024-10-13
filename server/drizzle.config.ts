import { defineConfig } from "drizzle-kit";
import { load } from "@std/dotenv";

await load({ export: true });

const databaseUrl = Deno.env.get("DATABASE_URL");

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl!,
  },
});

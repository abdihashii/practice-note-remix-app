import type { FrontendEnv } from "@notes-app/types";

/**
 * Gets environment variables with type safety
 */
export function getEnv(): FrontendEnv {
  const env: FrontendEnv = {
    NODE_ENV: import.meta.env.MODE as "development" | "production" | "test",
    API_URL: import.meta.env.VITE_API_URL || "http://localhost:8787/api/v1",
  };

  if (!env.API_URL) {
    throw new Error("Missing required environment variable: VITE_API_URL");
  }

  return env;
}

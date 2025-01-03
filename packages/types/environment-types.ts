export interface Environment {
  NODE_ENV: "development" | "production" | "test";
}

export interface FrontendEnv extends Environment {
  API_URL: string;
}

export interface BackendEnv extends Environment {
  DATABASE_URL: string;
  FRONTEND_URL: string;
}

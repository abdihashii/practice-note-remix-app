import { getEnv } from "~/config/env";

const env = getEnv();

export const API_URL = env.API_URL;
export const IS_DEVELOPMENT = env.NODE_ENV === "development";
export const IS_PRODUCTION = env.NODE_ENV === "production";
export const IS_TEST = env.NODE_ENV === "test";

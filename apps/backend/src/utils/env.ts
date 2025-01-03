type EnvVars = {
	DATABASE_URL: string;
	NODE_ENV: string;
	FRONTEND_URL: string;
	JWT_SECRET: string;
};

/**
 * Gets environment variables from process.env
 * @returns Environment variables
 */
export function getEnv(): EnvVars {
	return {
		DATABASE_URL: process.env.DATABASE_URL!,
		NODE_ENV: process.env.NODE_ENV!,
		FRONTEND_URL: process.env.FRONTEND_URL!,
		JWT_SECRET: process.env.JWT_SECRET!,
	};
}

/**
 * Validates that all required environment variables are present
 * @param env - Environment variables to validate
 * @throws Error if any required variables are missing
 */
export function validateEnv(env: EnvVars): void {
	const required = ['DATABASE_URL', 'NODE_ENV', 'FRONTEND_URL', 'JWT_SECRET'];
	const missing = required.filter((key) => !env[key as keyof EnvVars]);

	if (missing.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missing.join(', ')}`,
		);
	}
}

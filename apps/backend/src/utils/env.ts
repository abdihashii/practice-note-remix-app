type EnvVars = {
	DATABASE_URL: string;
	NODE_ENV?: string;
	FRONTEND_URL?: string;
};

/**
 * Gets environment variables from either context bindings (Cloudflare Workers)
 * or process.env (local development)
 * @param contextEnv - Environment bindings from Cloudflare Workers context
 * @returns Combined environment variables
 */
export function getEnv(contextEnv?: EnvVars): EnvVars {
	// If we're in a Cloudflare Worker environment, use the context env
	if (contextEnv) {
		return {
			...contextEnv,
			NODE_ENV: contextEnv.NODE_ENV || 'production',
		};
	}

	// Otherwise, we're in a local environment, use process.env
	return {
		DATABASE_URL: process.env.DATABASE_URL!,
		NODE_ENV: process.env.NODE_ENV || 'development',
		FRONTEND_URL: process.env.FRONTEND_URL,
	};
}

/**
 * Validates that all required environment variables are present
 * @param env - Environment variables to validate
 * @throws Error if any required variables are missing
 */
export function validateEnv(env: EnvVars): void {
	const required = ['DATABASE_URL'];
	const missing = required.filter((key) => !env[key as keyof EnvVars]);

	if (missing.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missing.join(', ')}`,
		);
	}
}

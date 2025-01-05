// Run the backend locally
import { config } from 'dotenv';

// Load environment variables from .env file
config();

import app from './index';
import { validateEnv } from './utils/env';

// Validate environment variables before starting server
console.log('Validating environment variables...');
validateEnv();
console.log('Environment variables validated successfully');

const server = Bun.serve({
	port: 8787,
	fetch(req: Request) {
		return app.fetch(req);
	},
});

console.log(`Server is running on http://localhost:${server.port}`);

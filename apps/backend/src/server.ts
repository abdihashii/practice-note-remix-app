// Production server for Render deployment
import { config } from 'dotenv';

// Load environment variables from .env file
// Note: In production, these are typically set through the platform's environment variables
config();

import app from './index';
import { validateEnv } from './utils/env';

// Validate environment variables before starting server
console.log('Validating environment variables...');
validateEnv();
console.log('Environment variables validated successfully');

const port = parseInt(process.env.PORT || '8787');

const server = Bun.serve({
	port,
	hostname: '0.0.0.0', // Required for Render to access the server
	fetch(req: Request) {
		return app.fetch(req);
	},
});

console.log(`Server is running on http://0.0.0.0:${server.port}`);

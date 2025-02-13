// Third-party imports
import { serve } from 'bun';
import { config } from 'dotenv';

// First-party imports
import app from './index';
import { validateEnv } from './utils/env';

// Load environment variables from .env file
console.log('Loading environment variables...');
config();
console.log('Environment variables loaded successfully\n');

// Validate environment variables before starting server
console.log('Validating environment variables...');
validateEnv();
console.log('Environment variables validated successfully\n');

const server = serve({
	port: 8787,
	fetch(req: Request) {
		return app.fetch(req);
	},
});

console.log(`Server is running on http://localhost:${server.port}`);
console.log('Press Ctrl+C to stop the server\n');

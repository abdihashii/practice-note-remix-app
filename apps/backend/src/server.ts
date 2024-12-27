// Production server for Render deployment
import app from './index';

const port = parseInt(process.env.PORT || '8787');

const server = Bun.serve({
	port,
	hostname: '0.0.0.0', // Required for Render to access the server
	fetch(req: Request) {
		return app.fetch(req);
	},
});

console.log(`Server is running on http://0.0.0.0:${server.port}`);

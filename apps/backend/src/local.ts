// Run the backend locally

import app from './index';

const server = Bun.serve({
	port: 8787,
	fetch(req: Request) {
		return app.fetch(req);
	},
});

console.log(`Server is running on http://localhost:${server.port}`);

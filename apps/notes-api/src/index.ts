import { desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';

import { notesTable } from './db/schema';
import { dbMiddleware } from './middleware/dbMiddleware';
import { Env, Variables } from './types';

// Create app with both Bindings and Variables types
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Test endpoint
app.get('/', (c) => c.text('Hello World!'));

// Inject the db into the context for all routes
app.use('*', dbMiddleware);

// Get all notes
app.get('/notes', async (c) => {
	const db = c.get('db');

	const notes = await db.select().from(notesTable).orderBy(desc(notesTable.updatedAt));

	return c.json(notes);
});

// Get a note by id
app.get('/notes/:id', async (c) => {
	const db = c.get('db');
	const id = c.req.param('id');

	const note = await db.select().from(notesTable).where(eq(notesTable.id, id));

	return c.json(note[0]);
});

// Create a new note
app.post('/notes', async (c) => {
	const db = c.get('db');
	const note = await c.req.json();

	const newNote = await db.insert(notesTable).values(note).returning();
	const createdNote = newNote[0];

	return c.json(createdNote);
});

export default app;

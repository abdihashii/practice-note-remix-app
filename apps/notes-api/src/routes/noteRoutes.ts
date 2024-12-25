import { desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';

import { notesTable } from '../db/schema';
import { Variables } from '../types';

export const noteRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// Get all notes
noteRoutes.get('/', async (c) => {
	const db = c.get('db');

	const notes = await db.select().from(notesTable).orderBy(desc(notesTable.updatedAt));

	return c.json(notes);
});

// Get a note by id
noteRoutes.get('/:id', async (c) => {
	const db = c.get('db');
	const id = c.req.param('id');

	const note = await db.select().from(notesTable).where(eq(notesTable.id, id));

	return c.json(note[0]);
});

// Create a new note
noteRoutes.post('/', async (c) => {
	const db = c.get('db');
	const note = await c.req.json();

	const newNote = await db.insert(notesTable).values(note).returning();
	const createdNote = newNote[0];

	return c.json(createdNote);
});

// Update a note
noteRoutes.put('/:id', async (c) => {
	const db = c.get('db');
	const id = c.req.param('id');
	const note = await c.req.json();

	const updatedNote = {
		...note,
		updatedAt: new Date(), // Pass Date object directly instead of ISO string
	};

	const updated = await db.update(notesTable).set(updatedNote).where(eq(notesTable.id, id)).returning();

	if (!updated.length) {
		return c.json({ message: `Note ${id} not found` }, 404);
	}

	return c.json(updated[0]);
});

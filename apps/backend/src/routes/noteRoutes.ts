// Third-party imports
import { desc, eq, sql } from 'drizzle-orm';
import { Hono } from 'hono';

// Local imports
import { notesTable } from '../db/schema';
import { CustomEnv } from '../types';

export const noteRoutes = new Hono<CustomEnv>();

// Get all notes
noteRoutes.get('/', async (c) => {
	const db = c.get('db');
	const page = parseInt(c.req.query('page') ?? '1');
	const limit = parseInt(c.req.query('limit') ?? '10');

	// Validate pagination params
	if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
		return c.json({ error: 'Invalid pagination parameters' }, 400);
	}

	const offset = (page - 1) * limit;

	// Get total count
	const totalCount = await db
		.select({ count: sql`count(*)` })
		.from(notesTable)
		.then((result) => Number(result[0].count));

	// Get paginated notes
	const notes = await db
		.select()
		.from(notesTable)
		.orderBy(desc(notesTable.updatedAt))
		.limit(limit)
		.offset(offset);

	return c.json({
		error: null,
		results: notes,
		pagination: {
			page,
			limit,
			total: totalCount,
			totalPages: Math.ceil(totalCount / limit),
		},
	});
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

	const updated = await db
		.update(notesTable)
		.set(updatedNote)
		.where(eq(notesTable.id, id))
		.returning();

	if (!updated.length) {
		return c.json({ message: `Note ${id} not found` }, 404);
	}

	return c.json(updated[0]);
});

// Delete a note
noteRoutes.delete('/:id', async (c) => {
	const db = c.get('db');
	const id = c.req.param('id');

	await db.delete(notesTable).where(eq(notesTable.id, id));

	return c.json({ message: `Note ${id} deleted` });
});

// Toggle favorite status
noteRoutes.patch('/:id/favorite', async (c) => {
	const db = c.get('db');
	const id = c.req.param('id');

	// Get current note to toggle its favorite status
	const currentNote = await db
		.select()
		.from(notesTable)
		.where(eq(notesTable.id, id));

	if (!currentNote.length) {
		return c.json({ error: 'Note not found' }, 404);
	}

	// Toggle the favorite status
	const updatedNote = await db
		.update(notesTable)
		.set({
			favorite: !currentNote[0].favorite,
			updatedAt: new Date(),
		})
		.where(eq(notesTable.id, id))
		.returning();

	return c.json(updatedNote[0]);
});

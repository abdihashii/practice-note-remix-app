// Third-party imports
import { or, ilike } from 'drizzle-orm';
import { Hono } from 'hono';

// Local imports
import { notesTable } from '../db/schema';
import { Env, Variables } from '../types';

export const searchRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// Search notes table
searchRoutes.get('/', async (c) => {
	const db = c.get('db');
	const searchQuery = c.req.query('q');
	const normalizedSearchQuery = searchQuery ? searchQuery.trim().toLowerCase() : '';

	let searchResults;

	if (normalizedSearchQuery === '') {
		// Return all notes if the search query is empty
		searchResults = await db.select().from(notesTable);
	} else {
		// Perform search with the given query on both title and content
		searchResults = await db
			.select()
			.from(notesTable)
			.where(or(ilike(notesTable.title, `%${normalizedSearchQuery}%`), ilike(notesTable.content, `%${normalizedSearchQuery}%`)))
			.orderBy(notesTable.updatedAt);
	}

	if (searchResults.length === 0) {
		return c.json({
			error: `No results found for "${searchQuery}"`,
			searchResults: [],
		});
	}

	return c.json({
		error: null,
		searchResults,
	});
});

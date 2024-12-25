// Third-party imports
import { desc, ilike, or, sql } from 'drizzle-orm';
import { Hono } from 'hono';

// Local imports
import { notesTable } from '../db/schema';
import { Env, Variables } from '../types';

export const searchRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

searchRoutes.get('/', async (c) => {
	try {
		const db = c.get('db');
		const searchQuery = c.req.query('q');
		const page = parseInt(c.req.query('page') ?? '1');
		const limit = parseInt(c.req.query('limit') ?? '10');

		// Validate pagination params
		if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
			return c.json({ error: 'Invalid pagination parameters' }, 400);
		}

		// Add input validation
		if (searchQuery && searchQuery.length < 1) {
			return c.json({ error: 'Search query must be at least 1 character long' }, 400);
		}

		const offset = (page - 1) * limit;
		const normalizedSearchQuery = searchQuery ? searchQuery.trim().toLowerCase() : '';
		const searchCondition =
			normalizedSearchQuery === ''
				? undefined
				: or(ilike(notesTable.title, `%${normalizedSearchQuery}%`), ilike(notesTable.content, `%${normalizedSearchQuery}%`));

		const totalCount = await db
			.select({ count: sql`count(*)` })
			.from(notesTable)
			.where(searchCondition)
			.then((result) => Number(result[0].count));

		const searchResults = await db
			.select()
			.from(notesTable)
			.where(searchCondition)
			.orderBy(desc(notesTable.updatedAt))
			.limit(limit)
			.offset(offset);

		return c.json({
			error: null,
			results: searchResults,
			pagination: {
				page,
				limit,
				total: totalCount,
				totalPages: Math.ceil(totalCount / limit),
			},
		});
	} catch (error) {
		console.error('Search error:', error);
		return c.json(
			{
				error: 'An error occurred while searching',
				results: [],
				pagination: {
					page: 0,
					limit: 0,
					total: 0,
					totalPages: 0,
				},
			},
			500,
		);
	}
});

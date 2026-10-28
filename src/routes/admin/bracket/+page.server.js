import { redirect } from '@sveltejs/kit';
import { isAdmin } from '#lib/server/admin.js';
import { getBracket, listEntrants } from '#lib/server/tournament.js';
import { hasDb } from '#lib/server/db.js';

export async function load({ cookies }) {
	if (!isAdmin(cookies)) redirect(303, '/admin');
	const [entrants, bracket] = await Promise.all([hasDb() ? listEntrants() : [], getBracket()]);
	return { entrants: entrants.map(({ email, ...e }) => e).sort((a, b) => a.name.localeCompare(b.name)), bracket };
}

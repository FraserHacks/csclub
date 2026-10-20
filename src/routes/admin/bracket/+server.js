import { error, json } from '@sveltejs/kit';
import { isAdmin } from '#lib/server/admin.js';
import { saveBracket } from '#lib/server/tournament.js';

export async function PUT({ request, cookies }) {
	if (!isAdmin(cookies)) error(401, 'Log in again.');
	const bracket = await request.json();
	if (bracket !== null && !Array.isArray(bracket?.pools)) error(400, 'Bad bracket.');
	await saveBracket(bracket);
	return json({ ok: true });
}

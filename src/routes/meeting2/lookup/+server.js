import { json } from '@sveltejs/kit';
import { hasToken, memberName } from '#lib/server/baserow.js';
import { getEntrant } from '#lib/server/tournament.js';

export async function GET({ url }) {
	const email = String(url.searchParams.get('email') ?? '').trim().toLowerCase();
	if (!/^\S+@\S+\.\S+$/.test(email)) return json({});
	try {
		const entrant = await getEntrant(email);
		if (entrant) return json({ name: entrant.name, skill: entrant.skill, characters: entrant.characters, controller: entrant.controller ? 'need' : 'own', returning: true });
		return json({ name: hasToken() ? await memberName(email) : '' });
	} catch (e) {
		console.error(e);
		return json({});
	}
}

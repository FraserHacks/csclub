import { createHash } from 'node:crypto';
import { db, must } from '#lib/server/db.js';

export async function getBracket() {
	if (!db) return null;
	const row = await db.from('brackets').select('bracket').order('id', { ascending: false }).limit(1).maybeSingle().then(must);
	return row?.bracket ?? null;
}

export async function saveBracket(bracket) {
	await db.from('brackets').insert({ bracket, entrants: await listEntrants() }).then(must);
}

const entrantId = (email) => createHash('sha256').update(`csclub:${email}`).digest('hex');

// One row per email so signing up again overwrites
export async function saveEntrant(entrant) {
	await db.from('entrants').upsert({ ...entrant, id: entrantId(entrant.email), at: new Date().toISOString() }).then(must);
}

export const getEntrant = (email) => (db ? db.from('entrants').select('*').eq('id', entrantId(email)).maybeSingle().then(must) : null);

export const countEntrants = () => db.from('entrants').select('id', { count: 'exact', head: true }).then(must);

export const listEntrants = () => db.from('entrants').select('*').then(must);

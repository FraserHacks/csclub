import { createHash } from 'node:crypto';
import { get, list, put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$app/env/private';

const PATH = 'tournament/bracket.json';
const ENTRANTS = 'tournament/entrants/';

export const hasBlob = () => Boolean(BLOB_READ_WRITE_TOKEN);

async function read(path) {
	const res = await get(path, { access: 'public', useCache: false, token: BLOB_READ_WRITE_TOKEN }).catch(() => null);
	return res?.statusCode === 200 ? new Response(res.stream).json() : null;
}

const write = (path, value, backup = false) =>
	put(path, JSON.stringify(value), {
		access: 'public',
		addRandomSuffix: backup,
		allowOverwrite: !backup,
		cacheControlMaxAge: 60,
		contentType: 'application/json',
		token: BLOB_READ_WRITE_TOKEN
	});

export const getBracket = () => (hasBlob() ? read(PATH) : null);

export async function saveBracket(bracket) {
	await write(PATH, bracket);
	await write(`tournament/backups/${new Date().toISOString()}.json`, { bracket, entrants: await listEntrants() }, true);
}

const entrantId = (email) => createHash('sha256').update(`csclub:${email}`).digest('hex');

// One blob per email so signups never race and signing up again overwrites
export async function saveEntrant(entrant) {
	const id = entrantId(entrant.email);
	await write(`${ENTRANTS}${id}.json`, { ...entrant, id, at: new Date().toISOString() });
}

export const getEntrant = (email) => (hasBlob() ? read(`${ENTRANTS}${entrantId(email)}.json`) : null);

export async function countEntrants() {
	let count = 0;
	let cursor;
	do {
		const page = await list({ prefix: ENTRANTS, cursor, token: BLOB_READ_WRITE_TOKEN });
		count += page.blobs.length;
		cursor = page.cursor;
	} while (cursor);
	return count;
}

export async function listEntrants() {
	const blobs = [];
	let cursor;
	do {
		const page = await list({ prefix: ENTRANTS, cursor, token: BLOB_READ_WRITE_TOKEN });
		blobs.push(...page.blobs);
		cursor = page.cursor;
	} while (cursor);
	return (await Promise.all(blobs.map((b) => read(b.pathname)))).filter(Boolean);
}

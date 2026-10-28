import { hasDb, listProjects } from '#lib/server/db.js';

export async function load() {
	if (!hasDb()) return { builds: [] };
	try {
		return { builds: (await listProjects()).filter((p) => p.meeting === 3) };
	} catch (e) {
		console.error(e);
		return { builds: [] };
	}
}

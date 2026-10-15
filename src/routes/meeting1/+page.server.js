import { hasProjects, listProjects } from '#lib/server/baserow.js';

export async function load() {
	if (!hasProjects()) return { builds: [] };
	try {
		return { builds: (await listProjects()).filter((p) => p.meeting === 1) };
	} catch (e) {
		console.error(e);
		return { builds: [] };
	}
}

import { defaultMembers } from '#lib/data.js';
import { hasDb, listMembers, listProjects } from '#lib/server/db.js';

async function safe(fn, fallback) {
	try {
		return await fn();
	} catch (e) {
		console.error(e);
		return fallback;
	}
}

export async function load() {
	const [members, dbProjects] = await Promise.all([
		hasDb() ? safe(listMembers, defaultMembers) : defaultMembers,
		hasDb() ? safe(listProjects, []) : []
	]);
	for (const p of dbProjects) {
		const url = p.href || `#p${p.id}`;
		for (const m of members.filter((m) => p.memberIds.includes(m.id))) if (!m.projects.includes(url)) m.projects.push(url);
	}
	return { members, dbProjects };
}

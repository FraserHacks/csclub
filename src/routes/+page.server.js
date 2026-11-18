import { defaultMembers, meetings } from '#lib/data.js';
import { hasDb, listMembers, listProjects } from '#lib/server/db.js';

const pick = (list) => list[Math.floor(Math.random() * list.length)];

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
	const featured = [
		...meetings.map((m) => pick(dbProjects.filter((p) => p.meeting === m.n))),
		pick(dbProjects.filter((p) => !p.meeting))
	].filter(Boolean);
	return { members, dbProjects, featured };
}

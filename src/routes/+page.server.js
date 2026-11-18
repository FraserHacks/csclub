import { defaultMembers, meetings } from '#lib/data.js';
import { hasDb, listMembers, listProjects } from '#lib/server/db.js';

const shuffle = (list) => {
	const a = [...list];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
};
const pick2 = (list) => shuffle(list).slice(0, 2);

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
	members.sort((a, b) => b.exec - a.exec || (!a.exec && b.projects.length - a.projects.length));
	const featured = shuffle([
		...meetings.flatMap((m) => pick2(dbProjects.filter((p) => p.meeting === m.n))),
		...pick2(dbProjects.filter((p) => !p.meeting))
	]);
	return { members, dbProjects, featured };
}

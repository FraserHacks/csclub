import { BASEROW_TOKEN, BASEROW_PROJECTS_TABLE } from '$app/env/private';

const API = 'https://api.baserow.io/api/database';
const TABLE = 1245022;
const PROJECTS = Number(BASEROW_PROJECTS_TABLE);

export const hasToken = () => Boolean(BASEROW_TOKEN);
export const hasProjects = () => Boolean(BASEROW_TOKEN && PROJECTS);

async function request(path, params = {}, init = {}) {
	const url = new URL(`${API}/${path}`);
	url.search = new URLSearchParams(params).toString();
	const res = await fetch(url, {
		...init,
		headers: { Authorization: `Token ${BASEROW_TOKEN}`, 'Content-Type': 'application/json' }
	});
	if (!res.ok) throw new Error(`Baserow ${res.status}: ${await res.text()}`);
	return res.json();
}

const fieldIds = {};

// Baserow ignores row filters by field name, so filters use field_<id>
async function filter(table, name, type, value) {
	if (!fieldIds[table]?.[name]) {
		const fields = await request(`fields/table/${table}/`);
		fieldIds[table] = Object.fromEntries(fields.map((f) => [f.name, f.id]));
	}
	return { [`filter__field_${fieldIds[table][name]}__${type}`]: value };
}

const rows = (params, init, table = TABLE) =>
	request(`rows/table/${table}/`, { user_field_names: 'true', ...params }, init);

export async function listMembers() {
	const { results } = await rows({
		size: '200',
		include: 'Name,Role,Exec,GitHub,Projects,Hidden',
		...(await filter(TABLE, 'Hidden', 'boolean', '0'))
	});
	return results.map((r) => ({
		id: r.id,
		name: r.Name?.trim() ?? '',
		role: r.Role?.trim() || 'Builder',
		exec: Boolean(r.Exec),
		github: r.GitHub?.trim().replace(/^@/, '') ?? '',
		projects: (r.Projects ?? '').split(/\s+/).filter((u) => u.startsWith('https://'))
	})).filter((m) => m.name);
}

export async function emailExists(email) {
	const { count } = await rows({ size: '1', include: 'Email', ...(await filter(TABLE, 'Email', 'equal', email)) });
	return count > 0;
}

export async function memberName(email) {
	const { results } = await rows({ size: '1', include: 'Name,Email', ...(await filter(TABLE, 'Email', 'equal', email)) });
	return results[0]?.Name?.trim() ?? '';
}

export async function createMember(member) {
	return rows({}, { method: 'POST', body: JSON.stringify(member) });
}

export async function listAllMembers() {
	const { results } = await rows({ size: '200', include: 'Name,Email,Grade,GitHub,Role,Exec,Projects,Hidden' });
	return results.map((r) => ({
		id: r.id,
		name: r.Name?.trim() ?? '',
		email: r.Email ?? '',
		grade: r.Grade ?? '',
		github: r.GitHub?.trim().replace(/^@/, '') ?? '',
		role: r.Role?.trim() || 'Builder',
		exec: Boolean(r.Exec),
		hidden: Boolean(r.Hidden),
		projects: (r.Projects ?? '').split(/\s+/).filter((u) => u.startsWith('https://'))
	}));
}

export async function listProjects({ hidden = false } = {}) {
	const [{ results }, members] = await Promise.all([
		rows({ size: '200', ...(!hidden && (await filter(PROJECTS, 'Hidden', 'boolean', '0'))) }, {}, PROJECTS),
		rows({ size: '200', include: 'Name' })
	]);
	const names = new Map(members.results.map((m) => [m.id, m.Name?.trim() ?? '']));
	const and = new Intl.ListFormat('en');
	return results.map((r) => {
		const memberIds = String(r.Member ?? '').split(/\D+/).map(Number).filter(Boolean);
		return {
			id: r.id,
			name: r.Name?.trim() ?? '',
			desc: r.Description?.trim() ?? '',
			type: ['hw', 'sw', 'both'].includes(r.Type) ? r.Type : 'hw',
			memberIds,
			by: and.format(memberIds.map((id) => names.get(id)).filter(Boolean)),
			src: r.Image ?? '',
			frame: r.Frame?.trim() || 'shot',
			href: r.Link?.trim() ?? '',
			meeting: Number(r.Meeting) || null,
			hidden: Boolean(r.Hidden)
		};
	}).filter((p) => p.name && p.src).reverse();
}

export async function createProject(project) {
	return rows({}, { method: 'POST', body: JSON.stringify(project) }, PROJECTS);
}

export async function updateProject(id, fields) {
	return rows({}, { method: 'PATCH', body: JSON.stringify(fields) }, `${PROJECTS}/${id}`);
}

export async function getProject(id) {
	return rows({}, {}, `${PROJECTS}/${id}`).catch(() => null);
}

export async function deleteProject(id) {
	const res = await fetch(`${API}/rows/table/${PROJECTS}/${id}/`, {
		method: 'DELETE',
		headers: { Authorization: `Token ${BASEROW_TOKEN}` }
	});
	if (!res.ok) throw new Error(`Baserow ${res.status}: ${await res.text()}`);
}

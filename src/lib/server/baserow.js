import { BASEROW_TOKEN } from '$app/env/private';

const API = 'https://api.baserow.io/api/database';
const TABLE = 1245022;

export const hasToken = () => Boolean(BASEROW_TOKEN);

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

let fieldIds;

// Baserow ignores row filters by field name, so filters use field_<id>
async function filter(name, type, value) {
	if (!fieldIds?.[name]) {
		const fields = await request(`fields/table/${TABLE}/`);
		fieldIds = Object.fromEntries(fields.map((f) => [f.name, f.id]));
	}
	return { [`filter__field_${fieldIds[name]}__${type}`]: value };
}

const rows = (params, init) => request(`rows/table/${TABLE}/`, { user_field_names: 'true', ...params }, init);

export async function listMembers() {
	const { results } = await rows({
		size: '200',
		include: 'Name,Role,Exec,GitHub,Projects,Hidden',
		...(await filter('Hidden', 'boolean', '0'))
	});
	return results.map((r) => ({
		name: r.Name?.trim() ?? '',
		role: r.Role?.trim() || 'Builder',
		exec: Boolean(r.Exec),
		github: r.GitHub?.trim().replace(/^@/, '') ?? '',
		projects: (r.Projects ?? '').split(/\s+/).filter((u) => u.startsWith('https://'))
	})).filter((m) => m.name);
}

export async function emailExists(email) {
	const { count } = await rows({ size: '1', include: 'Email', ...(await filter('Email', 'equal', email)) });
	return count > 0;
}

export async function createMember(member) {
	return rows({}, { method: 'POST', body: JSON.stringify(member) });
}

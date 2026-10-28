import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SECRET_KEY, SUPABASE_URL } from '$app/env/private';

const BUCKET = 'projects';

export const db = SUPABASE_URL && SUPABASE_SECRET_KEY ? createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, { auth: { persistSession: false } }) : null;

export const hasDb = () => Boolean(db);

export function must({ data, count, error }) {
	if (error) throw error;
	return data ?? count;
}

const toMember = (r) => ({
	id: r.id,
	name: r.name.trim(),
	role: r.role.trim() || 'Builder',
	exec: r.exec,
	github: r.github.trim().replace(/^@/, ''),
	projects: r.projects.split(/\s+/).filter((u) => u.startsWith('https://'))
});

export async function listMembers() {
	const rows = await db.from('members').select('id,name,role,exec,github,projects').eq('hidden', false).order('id').then(must);
	return rows.map(toMember).filter((m) => m.name);
}

export async function emailExists(email) {
	return (await db.from('members').select('id', { count: 'exact', head: true }).eq('email', email).then(must)) > 0;
}

export async function memberName(email) {
	const rows = await db.from('members').select('name').eq('email', email).limit(1).then(must);
	return rows[0]?.name.trim() ?? '';
}

export const createMember = (member) => db.from('members').insert(member).then(must);

export async function listAllMembers() {
	const rows = await db.from('members').select('*').order('id').then(must);
	return rows.map((r) => ({ ...toMember(r), email: r.email, grade: r.grade ?? '', hidden: r.hidden }));
}

export async function listProjects({ hidden = false } = {}) {
	const query = db.from('projects').select('*').order('id', { ascending: false });
	const [projects, members] = await Promise.all([
		(hidden ? query : query.eq('hidden', false)).then(must),
		db.from('members').select('id,name').then(must)
	]);
	const names = new Map(members.map((m) => [m.id, m.name.trim()]));
	const and = new Intl.ListFormat('en');
	return projects.map((r) => ({
		id: r.id,
		name: r.name.trim(),
		desc: r.description.trim(),
		type: r.type,
		memberIds: r.member_ids,
		by: and.format(r.member_ids.map((id) => names.get(id)).filter(Boolean)),
		src: r.image,
		frame: r.frame.trim() || 'shot',
		href: r.link.trim(),
		meeting: r.meeting,
		hidden: r.hidden
	})).filter((p) => p.name && p.src);
}

export const createProject = (project) => db.from('projects').insert(project).then(must);

export const updateProject = (id, fields) => db.from('projects').update(fields).eq('id', id).then(must);

export const getProject = (id) => db.from('projects').select('*').eq('id', id).maybeSingle().then(must).catch(() => null);

export const deleteProject = (id) => db.from('projects').delete().eq('id', id).then(must);

export async function uploadImage(path, file) {
	await db.storage.from(BUCKET).upload(path, file, { contentType: file.type || 'image/jpeg' }).then(must);
	return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function deleteImage(url) {
	const path = url.split(`/storage/v1/object/public/${BUCKET}/`)[1];
	if (path) await db.storage.from(BUCKET).remove([path]).then(must);
}

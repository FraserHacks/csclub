import { fail, redirect } from '@sveltejs/kit';
import { meetings } from '#lib/data.js';
import { checkPassword, hasAdmin, isAdmin, login, logout } from '#lib/server/admin.js';
import { createProject, deleteImage, deleteProject, getProject, hasDb, listAllMembers, listProjects, updateProject, uploadImage } from '#lib/server/db.js';

const MAX_IMAGE = 4 * 1024 * 1024;

export async function load({ cookies }) {
	if (!isAdmin(cookies)) return { authed: false, enabled: hasAdmin() };
	const [members, projects] = await Promise.all([listAllMembers(), hasDb() ? listProjects({ hidden: true }) : []]);
	return {
		authed: true,
		ready: hasDb(),
		members: members.sort((a, b) => a.name.localeCompare(b.name)),
		projects,
		meetings: meetings.map(({ n, title }) => ({ n, title }))
	};
}

export const actions = {
	login: async ({ request, cookies }) => {
		const form = await request.formData();
		if (!checkPassword(String(form.get('password') ?? ''))) return fail(401, { loginError: 'Wrong password.' });
		login(cookies);
		redirect(303, '/admin');
	},

	logout: async ({ cookies }) => {
		logout(cookies);
		redirect(303, '/admin');
	},

	add: async ({ request, cookies }) => {
		if (!isAdmin(cookies)) return fail(401, { error: 'Log in again.' });
		const form = await request.formData();
		const values = {
			name: String(form.get('name') ?? '').trim(),
			desc: String(form.get('desc') ?? '').trim(),
			type: String(form.get('type') ?? 'hw'),
			members: [...new Set(form.getAll('member').map(Number).filter(Boolean))],
			meeting: Number(form.get('meeting')) || null,
			link: String(form.get('link') ?? '').trim()
		};
		const image = form.get('image');

		if (!values.name || !values.members.length) return fail(400, { ...values, error: 'Needs a name and a member.' });
		if (!(image instanceof File) || !image.size) return fail(400, { ...values, error: 'Needs a photo.' });
		if (image.size > MAX_IMAGE) return fail(400, { ...values, error: 'Photo is too big.' });
		if (values.link && !/^https?:\/\//.test(values.link)) return fail(400, { ...values, error: 'Link has to start with https://' });

		try {
			const slug = values.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'project';
			const url = await uploadImage(`${slug}_${crypto.randomUUID().slice(0, 8)}.jpg`, image);
			await createProject({
				name: values.name,
				description: values.desc,
				type: ['hw', 'sw', 'both'].includes(values.type) ? values.type : 'hw',
				member_ids: values.members,
				image: url,
				link: values.link,
				meeting: values.meeting
			});
		} catch (e) {
			console.error(e);
			return fail(502, { ...values, error: 'Upload failed. Try again.' });
		}

		return { success: values.name, meeting: values.meeting };
	},

	edit: async ({ request, cookies }) => {
		if (!isAdmin(cookies)) return fail(401, { error: 'Log in again.' });
		const form = await request.formData();
		const id = Number(form.get('id'));
		const name = String(form.get('name') ?? '').trim();
		const type = String(form.get('type') ?? 'hw');
		const members = [...new Set(form.getAll('member').map(Number).filter(Boolean))];
		const link = String(form.get('link') ?? '').trim();
		if (!name || !members.length) return fail(400, { error: 'Needs a name and a member.' });
		if (link && !/^https?:\/\//.test(link)) return fail(400, { error: 'Link has to start with https://' });
		const project = id && (await getProject(id));
		if (!project) return fail(404, { error: 'Project not found.' });
		try {
			await updateProject(id, {
				name,
				description: String(form.get('desc') ?? '').trim(),
				type: ['hw', 'sw', 'both'].includes(type) ? type : 'hw',
				member_ids: members,
				link,
				meeting: Number(form.get('meeting')) || null
			});
		} catch (e) {
			console.error(e);
			return fail(502, { error: 'Save failed. Try again.' });
		}
		return { edited: name };
	},

	delete: async ({ request, cookies }) => {
		if (!isAdmin(cookies)) return fail(401, { error: 'Log in again.' });
		const id = Number((await request.formData()).get('id'));
		const project = id && (await getProject(id));
		if (!project) return fail(404, { error: 'Project not found.' });
		try {
			await deleteProject(id);
			await deleteImage(project.image);
		} catch (e) {
			console.error(e);
			return fail(502, { error: 'Delete failed. Try again.' });
		}
		return { deleted: project.name };
	}
};

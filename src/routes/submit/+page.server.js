import { fail } from '@sveltejs/kit';
import { madeDate, meetings } from '#lib/data.js';
import { createProject, hasDb, listMembers, uploadImage } from '#lib/server/db.js';

const MAX_IMAGE = 4 * 1024 * 1024;
const MAX_DESC = 280;
const GITHUB = /^https:\/\/(www\.)?github\.com\/\S+$/i;

export async function load() {
	if (!hasDb()) return { ready: false };
	const members = await listMembers();
	return {
		ready: true,
		maxDesc: MAX_DESC,
		members: members.map(({ id, name }) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name)),
		meetings: meetings.map(({ n, title, href }) => ({ n, title, href })).reverse()
	};
}

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const values = {
			name: String(form.get('name') ?? '').trim(),
			desc: String(form.get('desc') ?? '').trim(),
			type: String(form.get('type') ?? 'hw'),
			members: [...new Set(form.getAll('member').map(Number).filter(Boolean))],
			meeting: Number(form.get('meeting')) || null,
			github: String(form.get('github') ?? '').trim(),
			other: String(form.get('other') ?? '').trim(),
			month: String(form.get('month') ?? '')
		};
		const image = form.get('image');

		if (!values.name) return fail(400, { ...values, error: 'Needs a name.' });
		if (!values.members.length) return fail(400, { ...values, error: 'Pick at least one author.' });
		if (!(image instanceof File) || !image.size || !image.type.startsWith('image/')) return fail(400, { ...values, error: 'Needs a photo.' });
		if (image.size > MAX_IMAGE) return fail(400, { ...values, error: 'Photo is too big.' });
		if (values.desc.length > MAX_DESC) return fail(400, { ...values, error: `Description is over ${MAX_DESC} characters.` });
		if (values.github && !GITHUB.test(values.github)) return fail(400, { ...values, error: 'GitHub link has to start with https://github.com/' });
		if (values.other && !/^https?:\/\/\S+$/.test(values.other)) return fail(400, { ...values, error: 'Other link has to start with https://' });

		try {
			const known = new Set((await listMembers()).map((m) => m.id));
			const memberIds = values.members.filter((id) => known.has(id));
			if (!memberIds.length) return fail(400, { ...values, error: 'Pick at least one author.' });
			const slug = values.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'project';
			const url = await uploadImage(`${slug}_${crypto.randomUUID().slice(0, 8)}.jpg`, image);
			await createProject({
				name: values.name,
				description: values.desc,
				type: ['hw', 'sw', 'both'].includes(values.type) ? values.type : 'hw',
				member_ids: memberIds,
				image: url,
				link: values.github,
				link_other: values.other,
				meeting: meetings.some((m) => m.n === values.meeting) ? values.meeting : null,
				made: madeDate(values.meeting, values.month)
			});
		} catch (e) {
			console.error(e);
			return fail(502, { ...values, error: 'Upload failed. Try again.' });
		}

		return { success: values.name, meeting: values.meeting };
	}
};

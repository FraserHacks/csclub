import { fail, redirect } from '@sveltejs/kit';
import { CLASSROOM_URL } from '#lib/data.js';
import { createMember, emailExists, hasToken } from '#lib/server/baserow.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GITHUB = /^[a-z\d](?:[a-z\d-]{0,38})$/i;

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		if (form.get('website')) redirect(303, CLASSROOM_URL, { external: true });

		const values = {
			name: String(form.get('name') ?? '').trim().slice(0, 80),
			email: String(form.get('email') ?? '').trim().toLowerCase().slice(0, 120),
			grade: String(form.get('grade') ?? ''),
			github: String(form.get('github') ?? '').trim().replace(/^@/, '').replace(/^https?:\/\/github\.com\//i, '').replace(/\/.*$/, '')
		};

		if (!values.name) return fail(400, { ...values, error: 'Enter your name.' });
		if (!EMAIL.test(values.email)) return fail(400, { ...values, error: 'Enter a valid email.' });
		if (!['9', '10', '11', '12'].includes(values.grade)) return fail(400, { ...values, error: 'Pick your grade.' });
		if (values.github && !GITHUB.test(values.github)) return fail(400, { ...values, error: 'That GitHub username looks off.' });
		if (!hasToken()) return fail(503, { ...values, error: 'Signups are down right now. Use the classroom code below!' });

		try {
			if (!(await emailExists(values.email))) {
				await createMember({
					Name: values.name,
					Email: values.email,
					Grade: Number(values.grade),
					GitHub: values.github
				});
			}
		} catch (e) {
			console.error(e);
			return fail(502, { ...values, error: 'Something broke. Try again, or use the classroom code below!' });
		}

		redirect(303, CLASSROOM_URL, { external: true });
	}
};

import { fail } from '@sveltejs/kit';
import { createMember, emailExists, hasToken } from '#lib/server/baserow.js';

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		console.log('signup', JSON.stringify(Object.fromEntries(form)));

		const values = {
			name: String(form.get('name') ?? '').trim(),
			email: String(form.get('email') ?? '').trim().toLowerCase(),
			grade: String(form.get('grade') ?? ''),
			github: String(form.get('github') ?? '').trim().replace(/^@/, '').replace(/^https?:\/\/github\.com\//i, '').replace(/\/.*$/, '')
		};

		if (!hasToken()) return fail(503, { ...values, error: 'Signups are down right now. Use the classroom code below!' });

		try {
			if (!values.email || !(await emailExists(values.email))) {
				await createMember({
					Name: values.name,
					Email: values.email,
					Grade: Number(values.grade) || null,
					GitHub: values.github
				});
			}
		} catch (e) {
			console.error(e);
			return fail(502, { ...values, error: 'Something broke. Try again, or use the classroom code below!' });
		}

		return { success: true };
	}
};

import { fail } from '@sveltejs/kit';
import { SKILLS } from '#lib/data.js';
import { countEntrants, getBracket, hasBlob, saveEntrant } from '#lib/server/tournament.js';

export async function load() {
	try {
		const [bracket, count] = await Promise.all([getBracket(), hasBlob() ? countEntrants() : 0]);
		return { bracket, count };
	} catch (e) {
		console.error(e);
		return { bracket: null, count: 0 };
	}
}

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const values = {
			name: String(form.get('name') ?? '').trim(),
			email: String(form.get('email') ?? '').trim().toLowerCase(),
			skill: String(form.get('skill') ?? ''),
			characters: String(form.get('characters') ?? '').trim(),
			controller: String(form.get('controller') ?? '')
		};

		if (!values.name || !/^\S+@\S+\.\S+$/.test(values.email) || !SKILLS.includes(values.skill) || !['own', 'need'].includes(values.controller))
			return fail(400, { ...values, error: 'Fill in everything first.' });
		if (!hasBlob()) return fail(503, { ...values, error: 'Signups are down right now. Tell an exec!' });

		try {
			await saveEntrant({
				name: values.name,
				email: values.email,
				skill: values.skill,
				characters: values.characters,
				controller: values.controller === 'need'
			});
		} catch (e) {
			console.error(e);
			return fail(502, { ...values, error: 'Something broke. Try again!' });
		}

		return { success: true };
	}
};

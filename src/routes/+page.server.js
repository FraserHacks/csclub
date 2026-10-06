import { defaultMembers } from '#lib/data.js';
import { hasToken, listMembers } from '#lib/server/baserow.js';

export async function load() {
	if (!hasToken()) return { members: defaultMembers };
	try {
		return { members: await listMembers() };
	} catch (e) {
		console.error(e);
		return { members: defaultMembers };
	}
}

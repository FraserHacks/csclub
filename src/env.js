import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	BASEROW_TOKEN: {
		schema: (value) => value,
		description: 'Baserow database token with read + create on the members table'
	}
});

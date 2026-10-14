import { defineEnvVars } from '@sveltejs/kit/env';

const optional = (value) => value || undefined;

export const variables = defineEnvVars({
	BASEROW_TOKEN: {
		schema: (value) => value,
		description: 'Baserow database token with read + create on members, read + create + delete on projects'
	},
	BASEROW_PROJECTS_TABLE: {
		schema: optional,
		description: 'Baserow projects table ID'
	},
	ADMIN_PASSWORD: {
		schema: optional,
		description: 'Password for /admin, where projects are added'
	},
	BLOB_READ_WRITE_TOKEN: {
		schema: optional,
		description: 'Vercel Blob token for project images'
	}
});

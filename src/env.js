import { defineEnvVars } from '@sveltejs/kit/env';

const optional = (value) => value || undefined;

export const variables = defineEnvVars({
	SUPABASE_URL: {
		schema: optional,
		description: 'Supabase project URL'
	},
	SUPABASE_SECRET_KEY: {
		schema: optional,
		description: 'Supabase secret key (server only, bypasses RLS)'
	},
	ADMIN_PASSWORD: {
		schema: optional,
		description: 'Password for /admin, where projects are added'
	}
});

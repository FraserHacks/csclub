import { error } from '@sveltejs/kit';
import { SUPABASE_URL } from '$app/env/private';

export async function GET({ params, fetch }) {
	if (!/^[\w.-]+$/.test(params.path)) error(404, 'Not found');
	const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/projects/${params.path}`);
	if (!res.ok) error(404, 'Not found');
	return new Response(res.body, {
		headers: {
			'content-type': res.headers.get('content-type') ?? 'image/jpeg',
			'cache-control': 'public, max-age=31536000, s-maxage=31536000, immutable'
		}
	});
}

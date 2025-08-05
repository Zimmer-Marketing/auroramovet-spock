import { error } from '@sveltejs/kit';

export async function load({ locals }) {
	let route;
	try {
		route = await locals.pb.collection('pages').getFirstListItem(`slug="home"`, {
			expand: 'globals'
		});
	} catch (err) {
		throw error(404);
	}

	return {
		route
	};
}

export const trailingSlash = 'always';
export const prerender = false;

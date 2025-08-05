import { redirect, error } from '@sveltejs/kit';

export async function load({ locals, params }) {
	let route;
	let routeSlug = params.route.replace('/', '');
	if (routeSlug === 'home') {
		throw redirect(301, '/');
	}

	try {
		route = await locals.pb.collection('pages').getFirstListItem(`slug="${routeSlug}"`, {
			expand: 'faqs, globals'
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

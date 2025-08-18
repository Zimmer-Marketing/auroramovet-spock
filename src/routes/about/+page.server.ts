import { error } from '@sveltejs/kit';

export async function load({ locals }) {
	// Fetch the about page from pages collection
	let route;
	try {
		route = await locals.pb.collection('pages').getFirstListItem('slug="about"', {
			expand: 'faqs, globals'
		});
	} catch (err) {
		console.error('Could not fetch about page:', err instanceof Error ? err.message : String(err));
		throw error(404, 'About page not found');
	}

	// Fetch team members for the about page
	let teamMembers = [];
	try {
		teamMembers = await locals.pb.collection('staff').getFullList({
			sort: 'created'
		});
	} catch (err) {
		console.log('Could not fetch team members:', err instanceof Error ? err.message : String(err));
		// Silently fail if can't fetch team members
	}

	// Fetch related services for display
	let relatedServices = [];
	try {
		relatedServices = await locals.pb.collection('services').getFullList({
			limit: 3,
			sort: 'created'
		});
	} catch (err) {
		console.log('Could not fetch related services:', err instanceof Error ? err.message : String(err));
		// Silently fail if can't fetch related services
	}

	return {
		route,
		teamMembers,
		relatedServices
	};
}

export const trailingSlash = 'always';
export const prerender = false;
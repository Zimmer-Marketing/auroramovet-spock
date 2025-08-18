import { error } from '@sveltejs/kit';

export async function load({ locals }) {
	let route;
	
	// Fetch the contact-us page data
	try {
		route = await locals.pb.collection('pages').getFirstListItem('slug="contact-us"', {
			expand: 'faqs, globals'
		});
	} catch (err) {
		console.error('Could not fetch contact-us page:', err);
		throw error(404, 'Contact page not found');
	}

	return {
		route
	};
}
import { redirect, error } from '@sveltejs/kit';

export async function load({ locals, params }) {
	let route;
	let service;
	let routeType = 'page';
	let routeSlug;
	
	// Safely extract the route slug
	try {
		routeSlug = params.route ? params.route.replace(/^\/+|\/+$/g, '') : '';
		
		if (routeSlug === 'home') {
			throw redirect(301, '/');
		}
		
		if (!routeSlug) {
			throw error(404, 'Route not found');
		}
	} catch (err) {
		console.error('Error processing route params:', err);
		throw error(404, 'Invalid route');
	}

	// Always try to find a page first (since services should link to pages)
	try {
		route = await locals.pb.collection('pages').getFirstListItem(`slug="${routeSlug}"`, {
			expand: 'faqs, globals'
		});
		routeType = 'page';
	} catch (pageErr) {
		// If no page found, try to find a service (fallback)
		try {
			// Check if services collection exists
			await locals.pb.collection('services').getList(1, 1);
			
			service = await locals.pb.collection('services').getFirstListItem(`slug="${routeSlug}"`);
			routeType = 'service';
			route = service;
		} catch (serviceErr) {
			console.error('Neither page nor service found for slug:', routeSlug);
			throw error(404, 'Page not found');
		}
	}

	// Fetch related services for display (always try to get them)
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

	// Fetch testimonials for the carousel
	let testimonials = [];
	try {
		testimonials = await locals.pb.collection('testimonials').getFullList({
			sort: 'created'
		});
	} catch (err) {
		console.log('Could not fetch testimonials:', err instanceof Error ? err.message : String(err));
		// Silently fail if can't fetch testimonials
	}

	return {
		route,
		routeType,
		relatedServices,
		testimonials
	};
}

export const trailingSlash = 'always';
export const prerender = false;

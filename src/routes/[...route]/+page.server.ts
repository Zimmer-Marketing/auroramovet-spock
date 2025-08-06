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

	// First, try to find a matching service (only if services collection exists)
	let serviceFound = false;
	try {
		// Check if services collection exists by trying to get the collection info
		await locals.pb.collection('services').getList(1, 1);
		
		// Now try to find the service
		service = await locals.pb.collection('services').getFirstListItem(`slug="${routeSlug}"`);
		routeType = 'service';
		route = service;
		serviceFound = true;
	} catch (serviceErr) {
		// Services collection might not exist or service not found
		console.log('Service not found or services collection does not exist:', serviceErr instanceof Error ? serviceErr.message : String(serviceErr));
	}

	// If no service found, try to find a page
	if (!serviceFound) {
		try {
			route = await locals.pb.collection('pages').getFirstListItem(`slug="${routeSlug}"`, {
				expand: 'faqs, globals'
			});
			routeType = 'page';
		} catch (pageErr) {
			console.error('Neither service nor page found for slug:', routeSlug, pageErr);
			throw error(404, 'Page not found');
		}
	}

	// If it's a service, fetch additional service-specific data
	let relatedServices = [];
	if (routeType === 'service' && serviceFound) {
		try {
			relatedServices = await locals.pb.collection('services').getFullList({
				filter: `id != "${service.id}"`,
				limit: 3,
				sort: 'created'
			});
		} catch (err) {
			console.log('Could not fetch related services:', err instanceof Error ? err.message : String(err));
			// Silently fail if can't fetch related services
		}
	}

	return {
		route,
		routeType,
		relatedServices
	};
}

export const trailingSlash = 'always';
export const prerender = false;

import { error } from '@sveltejs/kit';

export async function load({ locals }) {
	let route = null;
	let faqs = [];

	// First try to find a dedicated FAQ page
	try {
		route = await locals.pb.collection('pages').getFirstListItem('slug="faq"', {
			expand: 'faqs, globals'
		});
		
		// If FAQ page exists and has FAQs, use them
		if (route.expand?.faqs) {
			faqs = route.expand.faqs;
		}
	} catch (err) {
		// Try alternative slug "faqs"
		try {
			route = await locals.pb.collection('pages').getFirstListItem('slug="faqs"', {
				expand: 'faqs, globals'
			});
			
			if (route.expand?.faqs) {
				faqs = route.expand.faqs;
			}
		} catch (err2) {
			// No dedicated FAQ page found, create a default one
			route = {
				title: 'Frequently Asked Questions',
				content: '<p>Find answers to commonly asked questions below.</p>',
				shortTitle: 'FAQs'
			};
		}
	}

	// If still no FAQs found, try to collect from all pages
	if (faqs.length === 0) {
		try {
			const allPages = await locals.pb.collection('pages').getFullList({
				expand: 'faqs'
			});
			
			// Collect all FAQs from all pages
			for (const page of allPages) {
				if (page.expand?.faqs && Array.isArray(page.expand.faqs)) {
					faqs.push(...page.expand.faqs);
				}
			}
		} catch (err) {
			console.log('Could not fetch FAQs from pages:', err instanceof Error ? err.message : String(err));
		}
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
		faqs,
		relatedServices
	};
}

export const trailingSlash = 'always';
export const prerender = false;
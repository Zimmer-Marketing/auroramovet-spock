export async function load({ locals, url }) {
	const currentRoute = url.pathname;
	const siteSettings = await locals.pb
		.collection('globals')
		.getFirstListItem(`slug="siteSettings"`, { expand: 'menu, socials, globals, globals.pages' });

	return {
		siteSettings,
		currentRoute
	};
}

export const trailingSlash = 'always';
export const prerender = true;

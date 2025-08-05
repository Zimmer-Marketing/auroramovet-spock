// /src/routes/sitemap.xml/+server.ts
import * as sitemap from 'super-sitemap';
import type { RequestHandler } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export const GET: RequestHandler = async () => {
	const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
	const posts = await pb.collection('posts').getFullList();
	const pages = await pb.collection('pages').getFullList();
	const siteSettings = await pb.collection('globals').getFirstListItem(`slug="siteSettings"`);
	const postSlugs = [];
	const paramSlugs = [];
	for (const post of posts) {
		postSlugs.push(post.slug);
	}
	for (const page of pages) {
		if (page.slug === 'home') continue;
		paramSlugs.push(page.slug);
	}
	return await sitemap.response({
		origin: `https://www.${siteSettings.meta.appDomain}`,
		paramValues: {
			'/[...route]': paramSlugs,
			'/posts/[post]': postSlugs
		},
		changefreq: 'daily'
	});
};

// import { content } from '$lib/store.js';
import { error } from '@sveltejs/kit';

export async function load({ locals, url }) {
	let route;
	let postsData;
	let topicsData;
	let perPage = 6;
	const pageNumber = url.searchParams.get('page') || 1;
	const searchQuery = url.searchParams.get('search') || '';
	const topicQuery = url.searchParams.get('topic') || '';
	// const conScroll = url.searchParams.get('?conscroll') ? true : false;
	const today = new Date().toISOString().split('T')[0];

	try {
		route = await locals.pb.collection('pages').getFirstListItem(`slug="posts"`);
		topicsData = await locals.pb.collection('topics').getFullList({
			sort: '-created'
		});
		switch (true) {
			case searchQuery !== '' && topicQuery !== '':
				postsData = await locals.pb.collection('posts').getList(pageNumber, perPage, {
					sort: '-created',
					expand: 'topics, globals',
					filter: `title ~ "${searchQuery}" || content ~ "${searchQuery}" && status = "Published" && publish <= "${today}"`
				});

				break;

			case searchQuery !== '':
				postsData = await locals.pb.collection('posts').getList(pageNumber, perPage, {
					sort: '-created',
					expand: 'topics, globals',
					filter: `title ~ "${searchQuery}" || content ~ "${searchQuery}" && status = "Published" && publish <= "${today}"`
				});
				break;

			case topicQuery !== '':
				postsData = await locals.pb.collection('posts').getList(pageNumber, perPage, {
					sort: '-created',
					expand: 'topics, globals',
					filter: `topics.slug ?~ "${topicQuery}" && status = "Published" && publish <= "${today}"`
				});
				break;

			default:
				// Handle the case when both searchQuery and topicQuery are empty strings
				postsData = await locals.pb.collection('posts').getList(pageNumber, perPage, {
					sort: '-created',
					expand: 'topics, globals',
					filter: `status = "Published" && publish <= "${today}"`
				});
				break;
		}
	} catch (err) {
		// Handle the error appropriately
		throw error(404);
	}

	return {
		route,
		postsData,
		topicsData
	};
}

// export async function actions()

export const trailingSlash = 'always';
export const prerender = false;

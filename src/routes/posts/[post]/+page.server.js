// import { processStacheCodes } from "$lib/processStacheCodes";
import { processStacheCodes } from '$lib/helpers/processStacheCodes.js';
import { serializeNonPOJOs } from '$lib/utils';
import { error } from '@sveltejs/kit';

export async function load({ fetch, url, params, locals }) {
	const routeParam = params.post.replace(/\/$/, '');

	const route = await serializeNonPOJOs(
		await locals.pb
			.collection('posts')
			.getFirstListItem(`slug="${routeParam}"`, { expand: 'topics, globals' })
	);

	//   Explanation of the Regular Expression:
	// /: Delimiters that mark the beginning and end of the regular expression.
	// {: Matches the literal { character.
	// [^{}]*: Matches zero or more characters that are not { or }. This ensures that you're matching content inside curly braces.
	// }: Matches the literal } character.

	if (/{[^{}]*}/.test(route.content)) {
		route.content = processStacheCodes(route.content);
	}

	return {
		route
	};
}

export const prerender = false;

<script lang="ts">
	import Breadcrumbs from '$lib/components/BreadCrumbs.svelte';
	import RouteMeta from '$lib/components/RouteMeta.svelte';
	import { fly } from 'svelte/transition';
	import type { PageData } from './$types';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import Pagination from '$lib/components/Pagination.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import Search from '$lib/components/Search.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let { route, siteSettings, postsData, topicsData } = $derived(data);

	let searchQuery = '';
</script>

<div
	class="mx-auto flex min-h-screen max-w-screen-2xl flex-col px-8 py-10 md:px-10 md:py-16"
	style="min-height:89svh"
>
	<RouteMeta {route} {siteSettings} />
	<Breadcrumbs {route} />
	<div class="col-span-full md:col-span-10 lg:col-span-7 xl:col-span-8">
		<h1>{route.title}</h1>
		{#if route.content}
			<article>
				{@html route.content}
			</article>
		{/if}

		<Search {postsData} {topicsData} />

		{#key postsData.page}
			<div
				in:fly={{ easing: cubicOut, y: 10, duration: 300, delay: 400 }}
				out:fly={{ easing: cubicIn, y: -10, duration: 300 }}
			>
				<ul class="divide-y divide-gray-200 dark:divide-gray-700">
					{#each postsData.items as post}
						<li class="py-12">
							<PostCard {post} />
						</li>
					{/each}
				</ul>
			</div>
		{/key}
	</div>
	<div class="mt-auto">
		<Pagination {postsData} />
	</div>
</div>

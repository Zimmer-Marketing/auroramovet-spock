<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination';
	import { fly } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { page } from '$app/stores';

	let { postsData } = $props();

	let topicQuery = $derived($page.url.searchParams.get('topic') || '');
	let searchQuery = $derived($page.url.searchParams.get('search') || '');

	let { perPage, items } = postsData;

	let searchParams =
		$derived(topicQuery === ''
			? '/posts?search=' + searchQuery + '&page=1'
			: '/posts?search=' + searchQuery + '&topic=' + topicQuery + '&page=1');
	let currentSearch = $derived($page.url.searchParams.get('search') || '');
</script>

<Pagination.Root count={postsData.totalItems} perPage={postsData.perPage}  >
	{#snippet children({ pages, currentPage })}
		<Pagination.Content>
			<Pagination.Item>
				{#if postsData.page > 1}
					<a
						href={searchQuery !== ''
							? `/posts?search=${searchQuery}&page=${postsData.page - 1}`
							: `/posts?page=${postsData.page - 1}`}
					>
						<Pagination.PrevButton />
					</a>
				{:else}
					<Pagination.PrevButton />
				{/if}
			</Pagination.Item>
			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item>
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item>
						<a
							href={searchQuery !== ''
								? `/posts?search=${searchQuery}&page=${page.value}`
								: `/posts?page=${page.value}`}
						>
							<Pagination.Link {page} isActive={currentPage == page.value}></Pagination.Link>
						</a>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item>
				{#if postsData.totalPages === page || postsData.page === postsData.totalPages}
					<Pagination.NextButton />
				{:else}
					<a
						href={searchQuery !== ''
							? `/posts?search=${searchQuery}&page=${postsData.page + 1}`
							: `/posts?page=${postsData.page + 1}`}
					>
						<Pagination.NextButton />
					</a>
				{/if}
			</Pagination.Item>
		</Pagination.Content>
	{/snippet}
</Pagination.Root>

<script lang="ts">
	import Time from 'svelte-time';
	import Button from './ui/button/button.svelte';
	export let post: any;
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

	let imgSrc = `${PUBLIC_POCKETBASE_URL}/api/files/${post.collectionId}/${post.id}/${post.images[0]}`;
</script>

<a
	href="/posts/{post.slug}"
	class="mx-auto flex w-full max-w-screen-2xl flex-col-reverse space-y-2 py-10 hover:animate-pulse md:grid md:grid-cols-3 md:px-10 md:py-16"
>
	<div class="col-span-2 flex flex-col justify-between gap-4">
		<div class="space-y-2">
			<h2>{post.title}</h2>
			<dl>
				<dt class="sr-only">Published on</dt>
				<dd class="font-display text-base font-medium leading-6">
					<Time timestamp={post.publish} format="MMMM D, YYYY" />
				</dd>
			</dl>
			{#if post.topics.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each post.expand?.topics as topic}
						<Button variant="outline" size="sm" href={`/posts?topic=${topic.slug}`}
							>{topic.title}</Button
						>
					{/each}
				</div>
			{/if}
			<div class="prose max-w-none text-gray-100">
				<p>{post.excerpt}</p>
			</div>
		</div>

		<Button class="w-fit md:min-w-[0px] md:py-3">Read more &rarr;</Button>
	</div>
	{#if post.images.length > 0}
		<div class="">
			<div class="flex w-full items-center justify-center pb-4 md:pr-5 md:pt-4">
				<img src={imgSrc} alt={post.title} class="w-full md:h-[200px]" />
			</div>
		</div>
	{/if}
</a>

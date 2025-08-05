<!-- @migration-task Error while migrating Svelte code: Encountered an export declaration pattern that is not supported for automigration. -->
<script lang="ts">
	import Breadcrumbs from '$lib/components/BreadCrumbs.svelte';
	import RouteMeta from '$lib/components/RouteMeta.svelte';
	import { browser } from '$app/environment';
	import Time from 'svelte-time';
	import PbImage from '$lib/components/PbImage.svelte';
	import * as Carousel from '$lib/components/ui/carousel';
	import Button from '$lib/components/ui/button/button.svelte';
	import CTAButtons from '$lib/components/globals/CTAButtons.svelte';
	import { Tags } from 'lucide-svelte';

	export let data;
	export let { route, siteSettings } = data;
	$: ({ route, siteSettings } = data);
</script>

<RouteMeta {route} {siteSettings} />

<div class="mx-auto flex max-w-screen-2xl flex-col px-8 py-10 md:px-10 md:py-16" data-theme="light">
	<Breadcrumbs {route} />
	<div class="grid gap-10 md:grid-cols-12">
		<div class="col-span-full max-w-3xl gap-4 md:col-span-10 lg:col-span-7 xl:col-span-8">
			<h1>{route.title}</h1>

			<p class="pb-4 font-semibold italic">
				<i
					>Published by {siteSettings.meta.siteTitle} on <Time
						timestamp={route.publish}
						format="MMMM D, YYYY"
					/></i
				>
			</p>
			{#if route.meta?.museid}
				{#if browser}
					<div class="max-w-5xl pb-5">
						<div style="position:relative;padding-bottom:56.25%">
							<iframe
								title={route.title}
								src={`https://muse.ai/embed/${route.meta?.museid}?links=0&logo=0&title=0`}
								style="width:100%;height:100%;position:absolute;left:0;top:0"
								frameborder="0"
								allowfullscreen
							/>
						</div>
					</div>
				{/if}
			{:else if route.images.length === 1}
				<PbImage
					record={route}
					photoName={route.images[0]}
					alt={route.title}
					height={800}
					width={600}
				/>
			{:else if route.images.length > 1}
				<Carousel.Root class="w-full max-w-xl">
					<Carousel.Content>
						{#each route.images as image, i (i)}
							<Carousel.Item>
								<div class="p-1">
									<PbImage
										record={route}
										photoName={image}
										alt={route.title + 1}
										height={800}
										width={600}
									/>
								</div>
							</Carousel.Item>
						{/each}
					</Carousel.Content>
					<Carousel.Previous />
					<Carousel.Next />
				</Carousel.Root>
			{/if}

			<div class="max-w-prose">
				<article>
					{@html route.content}
				</article>
			</div>
		</div>
		<div class="col-span-full lg:col-span-5 xl:col-span-4">
			{#if route.topics.length > 0}
				<h2 class="flex scroll-m-20 items-center gap-2 pb-3 tracking-tight">
					<Tags size={35} /> Topics
				</h2>
				<div class="flex flex-wrap gap-2">
					{#each route.expand.topics as topic}
						<Button variant="outline" size="sm" href={`/posts?topic=${topic.slug}`}
							>{topic.title}</Button
						>
					{/each}
				</div>
			{/if}
			<div class="mt-8 md:sticky md:top-20">
				<CTAButtons post={route} {siteSettings} />
			</div>
		</div>
	</div>
</div>

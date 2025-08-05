<script lang="ts">
	import RouteMeta from '$lib/components/RouteMeta.svelte';
	import type { PageData } from './$types';
	import * as Fathom from 'fathom-client';
	import StyleGuide from '$lib/components/StyleGuide.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let { route, siteSettings } = $derived(data);
</script>

<RouteMeta {route} {siteSettings} />

<div class="mx-auto max-w-screen-2xl px-8 pt-6 pb-10 md:px-10 md:pb-16">
	<div class="grid gap-10 md:grid-cols-12">
		<div class="col-span-full max-w-3xl gap-4 md:col-span-10 lg:col-span-7 xl:col-span-8">
			<h1>{route.title}</h1>
			<article>
				{@html route.content}
			</article>
		</div>
	</div>
	<h2>Fathom</h2>

	<a
		class="pb-6 text-lg font-bold text-red-500 underline"
		onclick={() => Fathom.trackEvent('Test Event')}
		href="https://zimmermarketing.com"
		>Make sure all form buttons and call buttons have a Fathom event. The code to this a tag is an
		example. Don't forget to import Fathom in script tags.</a
	>

	<StyleGuide />
</div>

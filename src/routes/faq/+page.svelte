<script lang="ts">
	import Breadcrumbs from '$lib/components/BreadCrumbs.svelte';
	import RouteMeta from '$lib/components/RouteMeta.svelte';
	import type { PageData } from './$types';
	import EditRecordButton from '$lib/components/pocketbase/EditRecordButton.svelte';
	import type { LayoutData } from '../$types';
	import FAQCard from '$lib/components/FAQCard.svelte';
	import ServiceCardsSidebar from '$lib/components/ServiceCardsSidebar.svelte';
	import GoogleReviewButton from '$lib/components/GoogleReviewButton.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let { route, faqs, relatedServices } = $derived(data);

	// Get siteSettings from parent layout
	const { siteSettings } = $derived(data as LayoutData);
</script>

<RouteMeta {route} {siteSettings} />

<div class="relative left-1/2 mx-auto grid w-screen max-w-screen-3xl grid-cols-1 gap-4 -translate-x-1/2 md:grid-cols-6">
	<div class="col-span-full md:col-span-4">
		<div class="py-3">
			<div class="px-4 md:px-8">
				<Breadcrumbs route={{ ...route, shortTitle: route.shortTitle }} />
			</div>
			<div class="relative px-4 md:px-8">
				<h1 class="text-primary">{route.title}</h1>
				{#if route.id}
					<EditRecordButton record={route} />
				{/if}
			</div>
			<article class="min-h-[1px] max-w-prose px-4 md:px-8">
				{#if route.content}
					{@html route.content}
				{/if}
			</article>
			{#if faqs && faqs.length > 0}
				<div class="px-4 md:px-8">
					<FAQCard {faqs} />
				</div>
			{:else}
				<div class="px-4 md:px-8">
					<p class="text-gray-600">No frequently asked questions available at this time.</p>
				</div>
			{/if}
		</div>
	</div>
	<div
		class="col-span-full flex flex-col gap-4 px-4 py-4 md:sticky md:top-4 md:col-span-2 md:self-start md:px-4"
	>
		<ServiceCardsSidebar services={relatedServices} />
		<GoogleReviewButton googleReviewLink={siteSettings.meta.googleReviewLink} />
	</div>
</div>
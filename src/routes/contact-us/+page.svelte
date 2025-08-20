<script lang="ts">
	import Breadcrumbs from '$lib/components/BreadCrumbs.svelte';
	import RouteMeta from '$lib/components/RouteMeta.svelte';
	import type { PageData } from './$types';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import ContactInfo from '$lib/components/ContactInfo.svelte';
	import EditRecordButton from '$lib/components/pocketbase/EditRecordButton.svelte';
	import type { LayoutData } from '../$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let { route } = $derived(data);

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
				<EditRecordButton record={route} />
			</div>
			<article class="min-h-[1px] max-w-prose px-4 md:px-8">
				{#if route.content}
					{@html route.content}
				{/if}
			</article>
			<div class="max-w-2xl px-4 md:px-8">
				<ContactForm />
			</div>
		</div>
	</div>

	<div
		class="col-span-full flex flex-col gap-4 px-4 py-4 md:sticky md:top-4 md:col-span-2 md:self-start md:px-4"
	>
		<ContactInfo {siteSettings} />
	</div>
</div>

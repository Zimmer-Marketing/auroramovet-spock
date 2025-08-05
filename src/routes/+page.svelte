<script lang="ts">
	import RouteMeta from '$lib/components/RouteMeta.svelte';
	import HomePage from '$lib/components/HomePage.svelte';
	import type { PageData } from './$types';
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let { route, siteSettings, staff, services, testimonials } = $derived(data);

	// Extract team members and services from route data if available
	let teamMembers = $derived(staff || []);

	// Use siteSettings for logo and hero image if available
	let logoImage = $derived(
		siteSettings?.images?.[0]
			? `${PUBLIC_POCKETBASE_URL}/api/files/${siteSettings.collectionId}/${siteSettings.id}/${siteSettings.images[0]}?thumb=0x0`
			: '/aurora-logo.png'
	);

	let heroImage = $derived(
		route?.images?.[0]
			? `${PUBLIC_POCKETBASE_URL}/api/files/${route.collectionId}/${route.id}/${route.images[0]}?thumb=0x0`
			: '/hero-building.jpg'
	);

	console.log(route);
</script>

<RouteMeta {route} {siteSettings} />

<HomePage {route} {heroImage} {logoImage} {teamMembers} {services} {testimonials} />

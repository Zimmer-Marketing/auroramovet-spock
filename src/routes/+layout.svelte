<script lang="ts">
	import '@fontsource-variable/inter';
	import '@fontsource-variable/jost';
	import '../app.css';
	import type { LayoutData } from './$types';
	import Footer from '$lib/components/Footer.svelte';
	import { fly } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { PUBLIC_FATHOM_ID, PUBLIC_FATHOM_URL } from '$env/static/public';
	import * as Fathom from 'fathom-client';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Navbar from '$lib/components/navigation/Navbar.svelte';
	import PreloadScreen from '$lib/components/PreloadScreen.svelte';

	if (PUBLIC_FATHOM_ID !== 'DEV') {
		onMount(async () => {
			Fathom.load(PUBLIC_FATHOM_ID, {
				url: PUBLIC_FATHOM_URL
			});
		});
	}

	// track a page view when the pathname changes
	$: ($page.url.pathname, browser && Fathom.trackPageview());

	export let data: LayoutData;

	$: ({ siteSettings, currentRoute } = data);
</script>

<svelte:head>
	{#if siteSettings?.meta?.sifitag && PUBLIC_FATHOM_ID !== 'DEV'}
		{@const sifitagId = siteSettings?.meta?.sifitag}
		<script async src={`https://tag.simpli.fi/sifitag/${sifitagId}`}></script>
	{/if}
</svelte:head>

<PreloadScreen />

<div class="relative mx-auto flex min-h-screen w-full max-w-screen-3xl flex-col" id="page">
	<main class="transition-outer relative mx-auto">
		<Navbar {siteSettings} />
		<div class="mx-auto w-full min-w-0">
			{#key currentRoute}
				<div
					in:fly={{ easing: cubicOut, y: 10, duration: 300, delay: 400 }}
					out:fly={{ easing: cubicIn, y: -10, duration: 300 }}
					class={$page.url.pathname === '/' ? '' : 'space-y-2'}
				>
					<slot />
				</div>
			{/key}
		</div>
	</main>
</div>
<!-- DO NOT REMOVE THIS FOOTER -->
<Footer {siteSettings} />

<!-- Navbar.svelte -->
<script lang="ts">
	import MobileMenu from '$lib/components/navigation/MobileMenu.svelte';
	import Logo from '$lib/components/navigation/Logo.svelte';
	import DesktopMenu from '$lib/components/navigation/DesktopMenu.svelte';
	import { Button } from '$lib/components/ui/button';
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import * as Fathom from 'fathom-client';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';

	interface Props {
		siteSettings: any;
	}

	let { siteSettings }: Props = $props();

	const logoSrc = `${PUBLIC_POCKETBASE_URL}/api/files/${siteSettings.collectionId}/${siteSettings.id}/${siteSettings?.images[0]}`;
	const mobileLogoSrc = `${PUBLIC_POCKETBASE_URL}/api/files/${siteSettings.collectionId}/${siteSettings.id}/${siteSettings?.images[1]}`;
	const scrollProgress = writable(0);
	const isScrolled = writable(false);

	let logoLoaded = $state(false);

	// Aurora navigation items - can be moved to siteSettings later
	const navigationItems = siteSettings?.expand?.menu;

	// Check if current page should have transparent header (no background blur)
	const isTransparentPage = $derived(() => {
		const pathname = $page.url.pathname;
		const transparentPages = ['/', '/home', '/pets', '/livestock', '/equine'];
		return transparentPages.some((path) => pathname === path || pathname === path + '/');
	});

	onMount(() => {
		// Trigger logo slide-down animation after preload screen finishes (500ms + 200ms buffer)
		setTimeout(() => {
			logoLoaded = true;
		}, 700);

		let targetHeight = 10;
		let currentHeight = 10;
		const maxScroll = 180;
		const minHeight = 6;
		const maxHeight = 10;
		const smoothingFactor = 0.12;

		let lastScrollY = 0;
		let ticking = false;
		const threshold = 1;

		let stableCount = 0;
		const stabilityThreshold = 3;

		const handleScroll = () => {
			// Update isScrolled state
			isScrolled.set(window.scrollY > 10);

			if (Math.abs(window.scrollY - lastScrollY) < threshold) return;

			if (!ticking) {
				requestAnimationFrame(() => {
					const scrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
					const newTargetHeight =
						Math.round((maxHeight - (maxHeight - minHeight) * scrollProgress) * 100) / 100;

					if (Math.abs(targetHeight - newTargetHeight) > 0.02) {
						targetHeight = newTargetHeight;
						stableCount = 0;
					}

					lastScrollY = window.scrollY;
					ticking = false;
				});
				ticking = true;
			}
		};

		let animationFrame: number;
		const animate = () => {
			const difference = Math.abs(targetHeight - currentHeight);

			if (difference > 0.001) {
				currentHeight += (targetHeight - currentHeight) * smoothingFactor;
				currentHeight = Math.round(currentHeight * 100) / 100;

				if (difference < 0.005) {
					stableCount++;
					if (stableCount >= stabilityThreshold) {
						currentHeight = targetHeight;
						stableCount = 0;
					}
				} else {
					stableCount = 0;
				}

				scrollProgress.set((maxHeight - currentHeight) / (maxHeight - minHeight));
			}
			animationFrame = requestAnimationFrame(animate);
		};
		animationFrame = requestAnimationFrame(animate);

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', handleScroll);
			cancelAnimationFrame(animationFrame);
		};
	});
</script>

<header
	class="sticky top-0 z-50 transition-all duration-300 md:pt-10 {isTransparentPage()
		? $isScrolled
			? 'bg-primary/90  backdrop-blur-sm'
			: 'bg-transparent'
		: 'bg-primary/90 backdrop-blur-md'}"
	style="height: {10 - 2 * $scrollProgress}rem"
>
	<div class="mx-auto h-full px-4 md:px-6">
		<!-- Mobile Layout -->
		<div class="flex h-full items-center justify-between md:hidden">
			<!-- Logo on the left -->
			<div class="flex items-center">
				<div
					class="transform transition-all duration-700 ease-out {logoLoaded
						? 'translate-y-0 opacity-100'
						: '-translate-y-20 opacity-0'}"
				>
					<Logo
						{siteSettings}
						{logoSrc}
						logoAlt="Aurora Animal Clinic"
						hidden={false}
						ariaLabel="Go to home page"
						shrink={$scrollProgress}
					/>
				</div>
			</div>

			<!-- Hamburger menu on the right -->
			<div>
				<MobileMenu {siteSettings} logoSrc={mobileLogoSrc} />
			</div>
		</div>

		<!-- Desktop Layout -->
		<div class="relative hidden h-full md:block">
			<!-- Logo positioned at bottom left -->
			<div class="absolute {isTransparentPage() ? '-bottom-2' : 'bottom-2'} left-12">
				<div
					class="transform transition-all duration-700 ease-out {logoLoaded
						? 'translate-y-0 opacity-100'
						: '-translate-y-8 opacity-0'}"
				>
					<Logo
						{siteSettings}
						{logoSrc}
						logoAlt="Aurora Animal Clinic"
						hidden={false}
						ariaLabel="Go to home page"
						shrink={$scrollProgress}
					/>
				</div>
			</div>

			<!-- Navigation positioned at top, spanning from above logo to right edge -->
			<nav class="absolute left-[250px] right-6 top-4 flex justify-between">
				{#each navigationItems as item}
					<a
						href={item.path}
						class="text-2xl font-light text-white transition-colors hover:text-white/80"
						class:font-semibold={$page.url.pathname === item.path}
					>
						{item.title}
					</a>
				{/each}
			</nav>
		</div>
	</div>
</header>

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
	class="sticky top-0 z-50 transition-all duration-300 {isTransparentPage()
		? $isScrolled
			? 'bg-primary/50 backdrop-blur-sm'
			: 'bg-transparent'
		: 'bg-primary/75 backdrop-blur-md'}"
	style="height: {10 - 4 * $scrollProgress}rem"
>
	<div class=" mx-auto h-full px-6">
		<div class="flex h-full items-center justify-center md:space-x-20">
			<!-- Mobile Menu Button -->
			<div class="md:hidden">
				<MobileMenu {siteSettings} {logoSrc} />
			</div>

			<!-- Logo -->
			<div class="flex items-center justify-center">
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

			<!-- Desktop Navigation - Centered -->
			<nav class="hidden justify-end space-x-9 md:flex">
				{#each navigationItems as item}
					<a
						href={item.path}
						class="text-2xl font-normal text-white transition-colors hover:text-white/80"
						style="text-shadow: rgba(0,0,0,0.5) 0px 4px 4px; font-family: 'Jost', sans-serif; line-height: 35px;"
						class:font-semibold={$page.url.pathname === item.path}
					>
						{item.title}
					</a>
				{/each}
			</nav>

			<!-- Desktop spacer to balance layout -->
			<div class="hidden md:flex md:w-[10rem]"></div>

			<!-- Right side items for mobile -->
			<div class="flex items-center space-x-4 md:hidden">
				{#if siteSettings.meta?.phone}
					{@const phone = siteSettings.meta?.phone}
					<Button
						onclick={() => Fathom.trackEvent('Phone Call')}
						href={`tel:${phone[0]}`}
						variant="ghost"
						size="icon"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-white"
							viewBox="0 0 23 20"
							fill="currentColor"
						>
							<path
								d="M20 14.92v3a1.998 1.998 0 0 1-2.18 2 19.791 19.791 0 0 1-8.63-3.07 19.502 19.502 0 0 1-6-6A19.79 19.79 0 0 1 .12 2.18 2 2 0 0 1 2.11 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 20 14.92Z"
							/>
						</svg>
					</Button>
				{/if}
			</div>
		</div>
	</div>
</header>

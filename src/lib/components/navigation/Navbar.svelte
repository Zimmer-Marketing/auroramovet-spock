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

	export let siteSettings: any;

	const logoSrc = `${PUBLIC_POCKETBASE_URL}/api/files/${siteSettings.collectionId}/${siteSettings.id}/${siteSettings?.images[0]}`;
	const scrollProgress = writable(0);

	onMount(() => {
		let targetHeight = 10;
		let currentHeight = 10;
		const maxScroll = 180; // 🎯 Slightly more responsive than 200, but not too aggressive
		const minHeight = 6;
		const maxHeight = 10;
		const smoothingFactor = 0.12; // 🚀 Slightly smoother than 0.1, but not too fast

		// 🛠️ Anti-shake variables - preventing the Chrome jitters!
		let lastScrollY = 0;
		let ticking = false;
		const threshold = 1; // 🛡️ Keep safe threshold to prevent oscillation

		// 🔒 Oscillation prevention
		let stableCount = 0;
		const stabilityThreshold = 3; // Frames of stability before considering settled

		const handleScroll = () => {
			// 🎯 Only update if we've scrolled enough to matter
			if (Math.abs(window.scrollY - lastScrollY) < threshold) return;

			if (!ticking) {
				requestAnimationFrame(() => {
					const scrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
					// 🔧 Round to prevent subpixel shaking in Chrome
					const newTargetHeight =
						Math.round((maxHeight - (maxHeight - minHeight) * scrollProgress) * 100) / 100;

					// 📏 Only update if the change is significant enough (keep safe threshold)
					if (Math.abs(targetHeight - newTargetHeight) > 0.02) {
						targetHeight = newTargetHeight;
						stableCount = 0; // Reset stability counter when target changes
					}

					lastScrollY = window.scrollY;
					ticking = false;
				});
				ticking = true;
			}
		};

		// 🎬 Enhanced animation with oscillation prevention
		let animationFrame: number;
		const animate = () => {
			const difference = Math.abs(targetHeight - currentHeight);

			// 🎭 Only animate if there's a meaningful difference
			if (difference > 0.001) {
				// 🌊 Smooth interpolation between current and target height
				currentHeight += (targetHeight - currentHeight) * smoothingFactor;

				// 🔧 Round the final value to prevent micro-movements
				currentHeight = Math.round(currentHeight * 100) / 100;

				// 🔒 Check for stability to prevent oscillation
				if (difference < 0.005) {
					stableCount++;
					if (stableCount >= stabilityThreshold) {
						// 🎯 Snap to target when stable enough
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
	class="sticky top-0 z-50 flex items-center justify-between bg-black/80 backdrop-blur-md shadow-md"
	style="height: {10 - 4 * $scrollProgress}rem"
>
	<div>
		<MobileMenu {siteSettings} {logoSrc} />
	</div>
	<Logo
		{siteSettings}
		{logoSrc}
		logoAlt="logo"
		hidden={true}
		ariaLabel="Go to home page"
		shrink={$scrollProgress}
	/>
	<div class="lg:hidden">
		<Button
			onclick={() => Fathom.trackEvent('Phone Call')}
			href={siteSettings.meta.phone[0]}
			variant="ghost"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-10 w-10 text-primary"
				viewBox="0 0 23 20"
				fill="none"
			>
				<path
					fill="currentColor"
					d="M20 14.92v3a1.998 1.998 0 0 1-2.18 2 19.791 19.791 0 0 1-8.63-3.07 19.502 19.502 0 0 1-6-6A19.79 19.79 0 0 1 .12 2.18 2 2 0 0 1 2.11 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 20 14.92Z"
				/>
			</svg>
		</Button>
	</div>

	<DesktopMenu {siteSettings} {logoSrc} shrink={$scrollProgress} />

	<!-- Contact Information - Desktop Only -->
	<div class="hidden min-w-[220px] flex-col items-start pr-6 text-white lg:flex">
		{#if siteSettings.meta?.phone}
			{@const phone = siteSettings.meta?.phone}
			<div class="mb-1 flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 23 20"
					class="mr-2 flex-shrink-0 text-gray-300"
					fill="currentColor"
				>
					<path
						d="M20 14.92v3a1.998 1.998 0 0 1-2.18 2 19.791 19.791 0 0 1-8.63-3.07 19.502 19.502 0 0 1-6-6A19.79 19.79 0 0 1 .12 2.18 2 2 0 0 1 2.11 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 20 14.92Z"
					/>
				</svg>
				<a
					href={`tel:${phone[0]}`}
					onclick={() => Fathom.trackEvent('Phone Call')}
					class="transition-colors hover:text-primary"
					aria-label="Call our phone number"
				>
					{phone[1]}
				</a>
			</div>
		{/if}

		{#if siteSettings.meta?.address}
			{@const address = siteSettings.meta?.address}
			<div class="flex">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 26 35"
					class="mr-2 mt-1 flex-shrink-0 text-gray-300"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M12.595 6.58a6.016 6.016 0 1 1 0 12.03 6.016 6.016 0 0 1 0-12.03Zm0-6.58C19.551 0 25.19 5.639 25.19 12.594c0 .269-.01.537-.026.802l-.01.157v.013c-.56 8.179-8.19 15.784-13.056 21.09C7.945 29.599 2.083 22.36.44 15.906A12.634 12.634 0 0 1 0 12.594C0 5.639 5.639 0 12.595 0Z"
						clip-rule="evenodd"
					/>
				</svg>
				<div class="flex flex-col">
					<a
						href={siteSettings.meta?.directionsLink || ''}
						class="flex flex-col text-sm not-italic transition-colors hover:text-primary"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Get directions to our location"
					>
						{#each address as line}
							{#if line !== address[0]}
								<span>{line}</span>
							{/if}
						{/each}
					</a>
				</div>
			</div>
		{/if}
	</div>
</header>

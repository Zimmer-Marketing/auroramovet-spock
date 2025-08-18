<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';

	interface Props {
		title: string;
		content: string;
		heroImage?: string;
		className?: string;
	}

	let { title, content, heroImage = '/hero-building.jpg', className = '' }: Props = $props();

	let heroLoaded = $state(false);

	onMount(() => {
		// Trigger hero slide-up animation at the same time as logo slide-down (700ms delay)
		setTimeout(() => {
			heroLoaded = true;
		}, 700);
	});
</script>

<section class="relative h-full pb-10 md:pb-32 md:pt-24 {className}" style="margin-top: calc(-1 * var(--navbar-height));">
	<!-- Hero positioned behind transparent navbar using negative margin equal to navbar height -->
	<div
		class="absolute inset-0 bg-cover bg-center bg-no-repeat"
		style="background-image: url('{heroImage}')"
	></div>
	<div class="absolute inset-0 bg-black/35"></div>

	<div
		class="relative z-10 flex h-full flex-col items-center justify-center pt-36 text-center text-primary-foreground md:pt-44"
	>
		<div
			class="w-full max-w-sm transform px-4 transition-all duration-700 ease-out md:w-1/2 md:max-w-none md:px-0 {heroLoaded
				? 'translate-y-0 opacity-100'
				: 'translate-y-8 opacity-0'}"
		>
			<h1
				class="mb-6 text-center text-xl font-bold md:px-12 md:text-6xl"
				style="text-shadow: rgba(0,0,0,0.5) 0px 4px 7px"
			>
				{@html title.replace(
					/^(.*?\s+to)\s+(.*)$/,
					'<span class="block">$1</span><span class="block">$2</span>'
				)}
			</h1>
			<p
				class="mx-auto max-w-sm px-2 text-base md:mb-6 md:max-w-4xl md:px-0 md:text-lg"
				style="text-shadow: rgba(0,0,0,0.5) 0px 4px 4px"
			>
				{@html content}
			</p>
			<Button size="lg" href="/contact-us" class="w-44 rounded-full px-8 py-6 text-2xl"
				>Contact Us</Button
			>
		</div>
	</div>
</section>

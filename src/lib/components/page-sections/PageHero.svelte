<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		title: string;
		subtitle?: string;
		content?: string;
		backgroundImage?: string;
		className?: string;
	}

	let {
		title,
		subtitle = '',
		content = '',
		backgroundImage = '/6b88cf6b7f70eb0603621916b7758dec4e0a5e6d.png',
		className = ''
	}: Props = $props();

	// Split title to style differently (first part light, second part bold)
	const titleParts = title.split(' ');
	const firstPart = titleParts.slice(0, Math.ceil(titleParts.length / 2)).join(' ');
	const secondPart = titleParts.slice(Math.ceil(titleParts.length / 2)).join(' ');
</script>

<section class={cn('relative h-[600px] overflow-hidden  md:-mt-44', className)}>
	<!-- Background Image with Overlay -->
	<div
		class="absolute inset-0 bg-contain bg-center bg-no-repeat"
		style="background-image: url('{backgroundImage}');  background-size: 100% ;"
	></div>
	<div class="absolute inset-0 bg-black/45"></div>

	<!-- Content -->
	<div class="relative z-10 flex h-full flex-col items-center justify-center px-6 text-white">
		<!-- Main Title -->
		<h1
			class="mb-4 text-center text-5xl font-bold leading-[65px] text-white drop-shadow-lg md:text-6xl"
		>
			<span class="font-extralight">{firstPart}</span>
			<span class="font-bold">{secondPart.toUpperCase()}</span>
		</h1>

		<!-- Subtitle -->
		{#if subtitle}
			<h2 class="mb-8 text-center text-3xl font-extralight leading-[65px] text-white md:text-4xl">
				{subtitle.toUpperCase()}
			</h2>
		{/if}

		<!-- Description -->
		{#if content}
			<p class="max-w-4xl text-center text-lg leading-[35px] text-white md:text-xl">
				{@html content}
			</p>
		{/if}
	</div>
</section>

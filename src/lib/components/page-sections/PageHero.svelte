<script lang="ts">
	import { cn } from '$lib/utils';
	import EditRecordButton from '$lib/components/pocketbase/EditRecordButton.svelte';

	interface Props {
		title: string;
		subtitle?: string;
		content?: string;
		backgroundImage?: string;
		className?: string;
		record?: any;
	}

	let { title, subtitle = '', content = '', backgroundImage, className = '', record }: Props = $props();

	// Split title to style differently (first part light, second part bold)
	const titleParts = title.split(' ');
	const firstPart = titleParts.slice(0, Math.ceil(titleParts.length / 2)).join(' ');
	const secondPart = titleParts.slice(Math.ceil(titleParts.length / 2)).join(' ');
</script>

<section class={cn('relative overflow-hidden md:h-[600px]', className)} style="margin-top: calc(-1 * var(--navbar-height));">
	<!-- Hero positioned behind transparent navbar using negative margin equal to navbar height -->
	<!-- Edit Record Button -->
	{#if record}
		<EditRecordButton {record} />
	{/if}

	<!-- Background Image with Overlay -->
	<div
		class="absolute inset-0 bg-cover bg-center bg-no-repeat"
		style="background-image: url('{backgroundImage}');"
	></div>
	<div class="absolute inset-0 bg-black/45"></div>

	<!-- Content -->
	<div
		class="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-44 text-white md:pt-32"
	>
		<!-- Main Title -->
		<h1
			class="mb-4 text-center text-2xl font-bold leading-10 text-white drop-shadow-lg md:text-6xl"
		>
			<span class="font-extralight">{firstPart}</span>
			<span class="font-bold">{secondPart.toUpperCase()}</span>
		</h1>

		<!-- Description -->
		{#if content}
			<p class="mb-8 max-w-4xl text-center text-lg leading-[35px] text-white md:text-xl">
				{@html content}
			</p>
		{/if}
	</div>
</section>

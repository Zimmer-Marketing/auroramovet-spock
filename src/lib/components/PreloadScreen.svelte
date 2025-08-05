<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let visible = true;

	onMount(() => {
		// Hide the preload screen after a short delay
		setTimeout(() => {
			visible = false;
		}, 500);
	});
</script>

{#if visible}
	<div
		class="preloader fixed inset-0 z-50 flex items-center justify-center bg-background"
		transition:fade={{ duration: 300 }}
	>
		<div class="text-center">
			<svg
				class="mx-auto h-16 w-16 animate-spin text-primary"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
			<h2 class="mt-4">Loading...</h2>
		</div>
	</div>
{/if}

<style>
	/* Hide preloader if JavaScript is disabled */
	:global(.no-js) .preloader {
		display: none;
	}
</style>

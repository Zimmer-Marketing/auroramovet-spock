<script lang="ts">
	import { Pencil } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { PUBLIC_FATHOM_ID, PUBLIC_POCKETBASE_URL } from '$env/static/public';
	export let record;
	export let classNames = 'bottom-5 right-10';

	// Initialize showButton based on PUBLIC_FATHOM_ID
	let showButton = PUBLIC_FATHOM_ID === 'DEV';
	// Track if shortcut keys are currently being pressed
	let isShortcutPressed = false;

	function handleKeydown(event: KeyboardEvent) {
		// Only handle keydown if not in DEV mode
		if (PUBLIC_FATHOM_ID !== 'DEV') {
			// Check for Option (Alt) + Shift + R (keyCode 82)
			if (event.altKey && event.shiftKey && event.keyCode === 82) {
				// Only toggle if the shortcut wasn't already pressed
				if (!isShortcutPressed) {
					showButton = !showButton;
					isShortcutPressed = true;
					event.preventDefault(); // Prevent default behavior
				}
			}
		}
	}

	function handleKeyup(event: KeyboardEvent) {
		// Reset the flag when any of the required keys are released
		if (!event.altKey || !event.shiftKey || event.keyCode === 82) {
			isShortcutPressed = false;
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup} />

{#if showButton}
	<div class={'absolute ' + classNames}>
		<Button
			variant="ghost"
			class="relative z-40 block rounded-full bg-black/50 p-3 text-yellow-600 hover:animate-ping"
			target="_blank"
			href={`${PUBLIC_POCKETBASE_URL}/_/#/collections?collection=${record.collectionId}&filter=&sort=-created&recordId=${record.id}`}
			title="Edit this record"
		>
			<Pencil class="h-4 w-4" />
		</Button>
	</div>
{/if}

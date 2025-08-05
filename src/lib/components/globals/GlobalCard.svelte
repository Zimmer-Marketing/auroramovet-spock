<script lang="ts">
	import EditRecordButton from '$lib/components/pocketbase/EditRecordButton.svelte';
	import * as Card from '$lib/components/ui/card';
	import { shouldShowOnPage } from '$lib/helpers/pageVisibility';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';
	import * as Fathom from 'fathom-client';
	let { record, specialPages = [] } = $props();

	// Check if the current page should show this card
	const shouldShow = $derived(shouldShowOnPage(record, specialPages));

	// Get the current pathname at the top level and remove trailing slash
	const currentPathname = $derived(page.url.pathname.replace(/\/$/, ''));
</script>

{#if shouldShow}
	<Card.Root class="relative">
		<Card.Header class="pb-0">
			<Card.Title>{record.title}</Card.Title>
			<Card.Description>{record.excerpt}</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if record.content}
				<article>
					{@html record.content}
				</article>
				{#if record.meta?.button}
					{@const { text, link } = record.meta?.button}
					{@const isExternal = link.startsWith('http')}
					<Button
						href={link}
						target={isExternal ? '_blank' : ''}
						onClick={() => {
							Fathom.trackEvent(text + ' Button Clicked');
						}}>{text}</Button
					>
				{/if}
			{/if}
			{#if record.expand?.pages}
				<div class="flex flex-col items-start gap-2 pt-4">
					{#each record.expand?.pages as page}
						<!-- Log the page slug and the comparison result -->
						{@const isActive = `/${page.slug}` === currentPathname}
						<!-- if current page, add class to button -->
						<Button href={`/${page.slug}`} variant={isActive ? 'outline' : 'secondary'}
							>{page.shortTitle || page.title}</Button
						>
					{/each}
				</div>
			{/if}
		</Card.Content>
		<EditRecordButton {record} />
	</Card.Root>
{/if}

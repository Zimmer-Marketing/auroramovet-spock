<script lang="ts">
	import { Clock } from 'radix-icons-svelte';
	import * as Fathom from 'fathom-client';
	import EditRecordButton from './pocketbase/EditRecordButton.svelte';
	import { Button } from '$lib/components/ui/button';
	interface Props {
		siteSettings: any;
	}

	let { siteSettings }: Props = $props();
	const phone = siteSettings.meta.phone || '';
	const address = siteSettings.meta.address || '';
	const hours = siteSettings.meta.hours || '';
</script>

<div class="relative grid w-full grid-flow-row auto-rows-max gap-6 py-5">
	{#if phone}
		<div class="flex items-center gap-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 23 20"
				fill="currentColor"
			>
				<path
					d="M20 14.92v3a1.998 1.998 0 0 1-2.18 2 19.791 19.791 0 0 1-8.63-3.07 19.502 19.502 0 0 1-6-6A19.79 19.79 0 0 1 .12 2.18 2 2 0 0 1 2.11 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 20 14.92Z"
				/>
			</svg>
			<p>
				Call <a href="tel:{phone[0]}" onclick={() => Fathom.trackEvent('Phone Call')}>{phone[1]}</a>
			</p>
		</div>
	{/if}
	{#if hours}
		<div class="flex items-center gap-2">
			<Clock class="h-5 w-5" />
			<ul>
				{#each hours as hour}
					<li>
						{@html hour.replace(/([^:]+):/, '<strong>$1</strong>:')}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
	{#if address}
		<div class="flex items-center gap-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 26 35"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M12.595 6.58a6.016 6.016 0 1 1 0 12.03 6.016 6.016 0 0 1 0-12.03Zm0-6.58C19.551 0 25.19 5.639 25.19 12.594c0 .269-.01.537-.026.802l-.01.157v.013c-.56 8.179-8.19 15.784-13.056 21.09C7.945 29.599 2.083 22.36.44 15.906A12.634 12.634 0 0 1 0 12.594C0 5.639 5.639 0 12.595 0Z"
					clip-rule="evenodd"
				/>
			</svg>
			<ul>
				{#each address as line, index}
					<li>
						{#if index === 0}
							<strong>{line}</strong>
						{:else}
							{line}
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<a
		href={siteSettings.meta.googleReviewLink}
		target="_blank"
		rel="noopener noreferrer"
		onclick={() => Fathom.trackEvent('Google Review Click')}
	>
		<Button variant="secondary" class="flex items-center gap-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="text-yellow-400"
			>
				<path
					d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
				/>
			</svg>
			<span>Leave Us a Review on Google</span>
		</Button>
	</a>

	<div class="w-full overflow-hidden rounded-lg shadow-lg">
		<iframe
			title={siteSettings.meta.siteTitle + ' Google Maps'}
			src={siteSettings.meta.googleMapsEmbedUrl}
			class="aspect-[4/3] w-full border-0 md:aspect-[4/6]"
			allowfullscreen={true}
			loading="lazy"
			referrerpolicy="no-referrer-when-downgrade"
		></iframe>
	</div>
	<EditRecordButton record={siteSettings} />
</div>

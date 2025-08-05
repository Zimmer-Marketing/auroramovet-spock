<script>
	export let record;
	import EditRecordButton from '../pocketbase/EditRecordButton.svelte';
	import { Button } from '$lib/components/ui/button';
</script>

<section class="bg-primary">
	<div class="relative mx-auto flex w-full max-w-screen-2xl">
		<h1 class="text-white">
			{record.title}
		</h1>
		<article class="max-w-prose text-lg text-white">
			{@html record.content}
		</article>

		{#if record.meta?.button}
			{@const button = record.meta.button}

			<Button href={button.link} variant="secondary" size="lg">
				{button.text}
			</Button>
		{/if}
		<EditRecordButton {record} />
	</div>
</section>

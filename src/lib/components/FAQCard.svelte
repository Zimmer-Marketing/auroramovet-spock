<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.ts';
	import EditRecordButton from '$lib/components/pocketbase/EditRecordButton.svelte';

	type FAQItem = {
		Answer: string;
		Question: string;
		id: string;
	};

	interface Props {
		faqs: FAQItem[];
	}

	let { faqs }: Props = $props();
</script>

<section class="w-full">
	<Accordion.Root class="mx-auto">
		{#each faqs as faq, i}
			<Accordion.Item class="relative mb-5 border-l-8 border-accent p-2 shadow-md" value="item-{i}">
				<Accordion.Trigger class="font-display font-bold md:text-xl"
					>{faq.question}</Accordion.Trigger
				>
				<Accordion.Content
					><article class="xl:text-base">{@html faq.answer}</article></Accordion.Content
				>
				<EditRecordButton record={faq} />
			</Accordion.Item>
		{/each}
	</Accordion.Root>
</section>

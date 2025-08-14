<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		className?: string;
	}

	let { className = '' }: Props = $props();

	let imagesVisible = $state(false);
	let sectionElement: HTMLElement;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						imagesVisible = true;
						observer.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.2,
				rootMargin: '0px 0px -100px 0px'
			}
		);

		if (sectionElement) {
			observer.observe(sectionElement);
		}

		return () => {
			observer.disconnect();
		};
	});

	onDestroy(() => {
		// Cleanup handled by onMount return
	});
</script>

<section bind:this={sectionElement} class="relative mt-20 bg-background py-44 {className}">
	<div class=" mx-auto px-2 md:px-6">
		<!-- Contact Images Grid - Wider than form -->
		<div class="mx-auto mb-8 max-w-4xl">
			<div 
				class="grid grid-cols-1 gap-6 md:grid-cols-3 transform transition-all duration-1000 ease-out {imagesVisible 
					? 'translate-x-0 opacity-100' 
					: '-translate-x-full opacity-0'}"
			>
				{#each ['contact-1.jpg', 'contact-2.jpg', 'conatct-3.jpg'] as image}
					<div class="overflow-hidden rounded-lg">
						<img
							src="/{image}"
							alt="Contact"
							class="h-64 w-full rounded-lg object-cover transition-transform duration-300"
						/>
					</div>
				{/each}
			</div>
		</div>

		<!-- Contact Form - Narrower -->
		<div class="mx-auto max-w-2xl">
			<Card.Root class="border-primary bg-primary text-primary-foreground">
				<Card.Header>
					<h2 class="text-center text-3xl font-bold">Schedule a Visit to the Vet</h2>
				</Card.Header>
				<Card.Content class="md:p-8">
					<ContactForm />
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</section>

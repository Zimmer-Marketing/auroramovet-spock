<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import ContactForm from '$lib/components/ContactForm.svelte';

	interface Props {
		className?: string;
	}

	let { className = '' }: Props = $props();
</script>

<section class="bg-background py-16 {className}">
	<div class="container mx-auto px-6">
		<div class="mx-auto max-w-2xl">
			<Card.Root class="border-primary bg-primary text-primary-foreground">
				<Card.Header>
					<h2 class="text-center text-3xl font-bold">Schedule a Visit to the Vet</h2>
				</Card.Header>
				<Card.Content class="p-8">
					<ContactForm />
					<div class="mt-6 text-center">
						<Button variant="secondary" class="px-8 py-3 font-bold tracking-wider">
							SEND MESSAGE
						</Button>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</section>
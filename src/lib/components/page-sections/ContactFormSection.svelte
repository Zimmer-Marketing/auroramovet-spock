<script lang="ts">
	import { cn } from '$lib/utils';
	import ContactForm from '$lib/components/ContactForm.svelte';

	interface Props {
		title?: string;
		subtitle?: string;
		className?: string;
	}

	let {
		title = 'Seeking Veterinary Care for Your Pet?',
		subtitle = 'Schedule a Visit to the Vet',
		className = ''
	}: Props = $props();
</script>

<section class={cn('bg-white py-16', className)}>
	<div class="container mx-auto px-6">
		<!-- Section Title -->
		<div class="mb-12 px-12 text-center md:px-0">
			<h2 class="mb-4 text-2xl font-bold text-[#2b482d] md:text-6xl md:leading-[65px]">
				{title}
			</h2>
		</div>

		<!-- Contact Form Card -->
		<div class="mx-auto max-w-4xl">
			<div class="rounded-[10px] bg-[#2b482d] p-8 shadow-xl md:p-12">
				<!-- Form Title -->
				<h3 class="mb-8 text-center text-4xl font-bold leading-[65px] text-white md:text-5xl">
					{subtitle}
				</h3>

				<!-- Contact Form -->
				<ContactForm />
			</div>
		</div>
	</div>
</section>

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

<section class={cn('py-16 bg-white', className)}>
	<div class="container mx-auto px-6">
		<!-- Section Title -->
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-5xl md:text-6xl font-bold leading-[65px] text-[#2b482d]">
				{title}
			</h2>
		</div>

		<!-- Contact Form Card -->
		<div class="mx-auto max-w-4xl">
			<div class="rounded-[10px] bg-[#2b482d] p-8 md:p-12 shadow-xl">
				<!-- Form Title -->
				<h3 class="mb-8 text-center text-4xl md:text-5xl font-bold leading-[65px] text-white">
					{subtitle}
				</h3>

				<!-- Contact Form -->
				<div class="space-y-6">
					<!-- Name Field -->
					<div class="rounded-[15px] bg-[#f3f3f3] p-6">
						<input
							type="text"
							placeholder="Your Name"
							class="w-full border-none bg-transparent text-xl text-[#2b482d] placeholder:text-[#2b482d] focus:outline-none font-normal"
						/>
					</div>

					<!-- Phone Field -->
					<div class="rounded-[15px] bg-[#f3f3f3] p-6">
						<input
							type="tel"
							placeholder="Your Phone Number"
							class="w-full border-none bg-transparent text-xl text-[#2b482d] placeholder:text-[#2b482d] focus:outline-none font-normal"
						/>
					</div>

					<!-- Email Field -->
					<div class="rounded-[15px] bg-[#f3f3f3] p-6">
						<input
							type="email"
							placeholder="Your Email"
							class="w-full border-none bg-transparent text-xl text-[#2b482d] placeholder:text-[#2b482d] focus:outline-none font-normal"
						/>
					</div>

					<!-- Message Field -->
					<div class="rounded-[15px] bg-[#f3f3f3] p-6">
						<textarea
							placeholder="Your Message"
							rows="5"
							class="w-full resize-none border-none bg-transparent text-xl text-[#2b482d] placeholder:text-[#2b482d] focus:outline-none font-normal"
						></textarea>
					</div>

					<!-- Submit Button -->
					<div class="flex justify-center pt-4">
						<button
							type="submit"
							class="rounded-[44px] bg-[#f1f5f1] px-12 py-4 text-xl font-bold text-[#0d2623] transition-all hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
						>
							SEND MESSAGE
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
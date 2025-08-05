<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface Testimonial {
		id?: string;
		name: string;
		review: string;
		rating?: number;
	}

	interface Props {
		testimonials?: Testimonial[];
		className?: string;
	}

	let { testimonials = [], className = '' }: Props = $props();

	// Default to 5 stars if rating is not provided
	const getRating = (testimonial: Testimonial) => testimonial.rating || 5;

	// Carousel state
	let currentIndex = $state(0);
	let autoPlayInterval: ReturnType<typeof setInterval> | undefined;

	// Number of testimonials to show at once
	const testimonialsPerView = 3;

	// Calculate the number of pages
	const totalPages = $derived(Math.ceil(testimonials.length / testimonialsPerView));

	// Get the current set of testimonials to display
	const visibleTestimonials = $derived(
		testimonials.slice(currentIndex * testimonialsPerView, (currentIndex + 1) * testimonialsPerView)
	);

	// Navigation functions
	const goToPage = (index: number) => {
		currentIndex = index;
		resetAutoPlay();
	};

	const nextPage = () => {
		currentIndex = (currentIndex + 1) % totalPages;
		resetAutoPlay();
	};

	const prevPage = () => {
		currentIndex = (currentIndex - 1 + totalPages) % totalPages;
		resetAutoPlay();
	};

	// Auto-play functionality
	const startAutoPlay = () => {
		autoPlayInterval = setInterval(() => {
			nextPage();
		}, 5000); // Change slide every 5 seconds
	};

	const stopAutoPlay = () => {
		if (autoPlayInterval) {
			clearInterval(autoPlayInterval);
		}
	};

	const resetAutoPlay = () => {
		stopAutoPlay();
		startAutoPlay();
	};

	onMount(() => {
		if (testimonials.length > testimonialsPerView) {
			startAutoPlay();
		}
	});

	onDestroy(() => {
		stopAutoPlay();
	});
</script>

<section class="relative overflow-hidden bg-[#2b482d] py-24 {className}">
	<div class="pointer-events-none absolute inset-0">
		<div class="absolute -top-10 left-0 right-0 h-32 opacity-30">
			<img
				src="/03267d81b22af4c48f998cfa906042bed8183496.png"
				alt=""
				class="h-full w-full rotate-[2.553deg] transform object-cover"
			/>
		</div>
		<div class="absolute -bottom-10 left-0 right-0 h-32 opacity-30">
			<img
				src="/03267d81b22af4c48f998cfa906042bed8183496.png"
				alt=""
				class="h-full w-full rotate-[182.543deg] transform object-cover"
			/>
		</div>
	</div>

	<div class="container relative z-10 mx-auto px-6">
		<h2 class="mb-16 text-center text-4xl font-bold text-white md:text-5xl">
			Maintaining Outstanding<br />
			Standards of Veterinary Care!
		</h2>

		<!-- Carousel Container -->
		<div class="relative mx-auto max-w-6xl">
			<!-- Previous Button -->
			{#if testimonials.length > testimonialsPerView}
				<button
					onclick={() => prevPage()}
					class="absolute left-0 top-1/2 z-20 -translate-x-12 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20"
					aria-label="Previous testimonials"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
			{/if}

			<!-- Testimonials Grid -->
			<div class="grid gap-8 transition-all duration-500 md:grid-cols-3">
				{#each visibleTestimonials as testimonial, index}
					<div class="group text-center">
						<div
							class={`rounded-2xl p-8 transition-all duration-300 ${
								index === 1 && visibleTestimonials.length === 3
									? 'scale-105 transform bg-white text-gray-800 shadow-2xl'
									: 'bg-transparent text-white/90'
							}`}
						>
							<div class="mb-4 text-6xl opacity-30">"</div>
							<p class="mb-6 min-h-[120px] text-base leading-relaxed">
								{testimonial.review}
							</p>
							<div class="mb-4 flex justify-center space-x-1">
								{#each Array(getRating(testimonial)) as _}
									<span
										class={`text-2xl ${
											index === 1 && visibleTestimonials.length === 3
												? 'text-gray-600'
												: 'text-white/80'
										}`}>★</span
									>
								{/each}
							</div>
							<p class="text-lg font-semibold">{testimonial.name}</p>
						</div>
					</div>
				{/each}
			</div>

			<!-- Next Button -->
			{#if testimonials.length > testimonialsPerView}
				<button
					onclick={() => nextPage()}
					class="absolute right-0 top-1/2 z-20 -translate-y-1/2 translate-x-12 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20"
					aria-label="Next testimonials"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			{/if}
		</div>

		<!-- Navigation Dots -->
		{#if totalPages > 1}
			<div class="mt-12 flex justify-center space-x-3">
				{#each Array(totalPages) as _, pageIndex}
					<button
						onclick={() => goToPage(pageIndex)}
						class={`h-2 w-16 rounded-full transition-all ${
							pageIndex === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
						}`}
						aria-label={`Go to testimonials page ${pageIndex + 1}`}
					></button>
				{/each}
			</div>
		{/if}
	</div>
</section>


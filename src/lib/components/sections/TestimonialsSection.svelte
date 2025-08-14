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
		showTitle?: boolean;
		showWaveBackground?: boolean;
	}

	let {
		testimonials = [],
		className = '',
		showTitle = false,
		showWaveBackground = false
	}: Props = $props();

	// Default to 5 stars if rating is not provided
	const getRating = (testimonial: Testimonial) => testimonial.rating || 5;

	// Carousel state - now tracks individual testimonial index, not page
	let currentIndex = $state(0);
	let autoPlayInterval: ReturnType<typeof setInterval> | undefined;

	// Number of testimonials to show at once
	const testimonialsPerView = 3;

	// Get the current set of testimonials to display (sliding window of 3)
	const visibleTestimonials = $derived(
		testimonials.length <= testimonialsPerView
			? testimonials
			: (() => {
					const result = [];
					for (let i = 0; i < testimonialsPerView; i++) {
						const index = (currentIndex + i) % testimonials.length;
						result.push(testimonials[index]);
					}
					return result;
				})()
	);

	// Calculate total pages for dots
	const totalPages = $derived(testimonials.length);

	// Navigation functions
	const goToPage = (index: number) => {
		currentIndex = index;
		resetAutoPlay();
	};

	const nextPage = () => {
		currentIndex = (currentIndex + 1) % testimonials.length;
		resetAutoPlay();
	};

	const prevPage = () => {
		currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
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

<!-- Testimonials Section -->
<section class="relative py-32 md:py-64 {className}">
	{#if showWaveBackground}
		<!-- Background with separate top and bottom testimonials SVGs -->
		<div class="absolute inset-0 bg-[#2b482d]">
			<!-- Top wave -->
			<div class="absolute left-0 top-0 w-full">
				<img src="/testimonialsTop.svg" alt="" class="h-auto w-full" />
			</div>
			<!-- Bottom wave -->
			<div class="absolute -bottom-8 left-0 w-full md:-bottom-32">
				<img src="/testimonialsBottom.svg" alt="" class="h-auto w-full" />
			</div>
		</div>
	{:else}
		<!-- Simple background for non-homepage usage -->
		<div class="absolute inset-0 bg-[#2b482d]"></div>
	{/if}
	<div class="relative z-10 w-full px-4 md:px-2 lg:px-12 xl:px-20">
		{#if showTitle}
			<h2 class="mb-16 text-center text-2xl font-bold leading-relaxed text-white md:text-6xl">
				Maintaining Outstanding<br />
				Standards of Veterinary Care!
			</h2>
		{/if}

		<!-- Carousel Container -->
		<div class="relative mx-auto w-full max-w-screen-2xl overflow-hidden">
			<!-- Previous Button -->
			{#if testimonials.length > testimonialsPerView}
				<button
					onclick={() => prevPage()}
					class="absolute top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 md:-left-16 md:block lg:-left-20"
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
			<div
				class="grid min-h-[400px] grid-cols-1 items-center gap-8 md:grid-cols-3 md:gap-12 lg:gap-20 xl:gap-24"
			>
				{#each visibleTestimonials as testimonial, index}
					{#if index === 1}
						<!-- Center testimonial with white card and speech bubble -->
						<div class="flex flex-col items-center text-center">
							<div class="relative w-full rounded-2xl bg-white px-8 py-10 text-gray-800 shadow-2xl">
								<!-- Speech bubble pointer -->
								<div
									class="absolute -bottom-4 left-1/2 h-0 w-0 -translate-x-1/2 transform border-l-[20px] border-r-[20px] border-t-[20px] border-l-transparent border-r-transparent border-t-white"
								></div>

								<!-- Review text with quote -->
								<div class="text-left">
									<!-- Large decorative quote positioned right above text -->
									<div class="-mb-4 text-5xl text-gray-300">"</div>
									<p class="mb-8 min-h-[100px] pl-8 text-base leading-relaxed text-gray-700">
										{@html testimonial.review}
									</p>
								</div>

								<!-- Stars -->
								<div class="flex justify-center space-x-1">
									{#each Array(getRating(testimonial)) as _}
										<span class="text-2xl text-yellow-400">★</span>
									{/each}
								</div>
							</div>
							<!-- Name below the card -->
							<p class="mt-8 text-xl font-bold text-white">{testimonial.name}</p>
						</div>
					{:else}
						<!-- Side testimonials blending with background - hidden on mobile -->
						<div class="hidden flex-col items-center text-center text-white/90 md:flex">
							<div class="w-full px-4">
								<!-- Review text with quote -->
								<div class="text-left">
									<!-- Large decorative quote positioned right above text -->
									<div class="-mb-4 text-5xl text-white/30">"</div>
									<p class="mb-8 min-h-[100px] pl-8 text-base leading-relaxed">
										{@html testimonial.review}
									</p>
								</div>

								<!-- Stars -->
								<div class="mb-4 flex justify-center space-x-1">
									{#each Array(getRating(testimonial)) as _}
										<span class="text-2xl text-yellow-400">★</span>
									{/each}
								</div>

								<!-- Name -->
								<p class="text-lg font-semibold">{testimonial.name}</p>
							</div>
						</div>
					{/if}
				{/each}
			</div>

			<!-- Next Button -->
			{#if testimonials.length > testimonialsPerView}
				<button
					onclick={() => nextPage()}
					class="absolute top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 md:-right-16 md:block lg:-right-20"
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

		<!-- Navigation Dots - show dots for number of testimonials -->
		{#if testimonials.length > testimonialsPerView}
			<div class="mt-16 flex justify-center space-x-3">
				{#each Array(testimonials.length) as _, dotIndex}
					<button
						onclick={() => goToPage(dotIndex)}
						class={`h-2 w-2 rounded-full transition-all ${
							dotIndex === currentIndex ? 'w-8 bg-white' : 'bg-white/40 hover:bg-white/60'
						}`}
						aria-label={`Go to testimonial ${dotIndex + 1}`}
					></button>
				{/each}
			</div>
		{/if}
	</div>
</section>

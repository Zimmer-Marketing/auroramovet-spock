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

<!-- Testimonials Section with Figma-generated wave design -->
<section class="relative py-64 {className}">
	<!-- Background layers matching Figma structure -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<!-- Center dark green rectangle as base -->
		<div class="absolute inset-0 bg-[#2b482d]"></div>

		<!-- Top wave image (rotated and centered) -->
		<div class="absolute left-1/2 top-1 z-[999] flex -translate-x-1/2 items-center justify-center">
			<div class="flex-none">
				<div
					class="bg-cover bg-center bg-no-repeat"
					style="background-image: url('/03267d81b22af4c48f998cfa906042bed8183496.png'); width: 100vw; height: 226px; min-width: 1506px;"
				/>
			</div>
		</div>

		<!-- Bottom wave image (rotated and centered) -->
		<div
			class="absolute bottom-0 left-1/2 flex -translate-x-1/2 translate-y-16 items-center justify-center"
		>
			<div class="flex-none rotate-[182.543deg]">
				<div
					class="bg-cover bg-center bg-no-repeat"
					style="background-image: url('/03267d81b22af4c48f998cfa906042bed8183496.png'); width: 100vw; height: 226px; min-width: 1506px;"
				/>
			</div>
		</div>
	</div>
	<div class="relative z-10 w-full px-6 lg:px-12 xl:px-20">
		<h2 class="mb-16 text-center text-2xl font-bold text-white md:text-5xl">
			Maintaining Outstanding<br />
			Standards of Veterinary Care!
		</h2>

		<!-- Carousel Container -->
		<div class="relative mx-auto w-full max-w-screen-2xl">
			<!-- Previous Button -->
			{#if testimonials.length > testimonialsPerView}
				<button
					onclick={() => prevPage()}
					class="absolute -left-16 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 lg:-left-20"
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
					class="absolute -right-16 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 lg:-right-20"
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

	<!-- Bottom wave transition to next section -->
	<div class="z-5 absolute -bottom-1 left-0 right-0 w-full">
		<svg
			viewBox="0 0 1440 80"
			class="h-20 w-full"
			preserveAspectRatio="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M0,20 C360,60 720,10 1080,40 C1260,55 1380,45 1440,50 L1440,80 L0,80 Z"
				fill="#f9fafb"
			/>
		</svg>
	</div>
</section>
